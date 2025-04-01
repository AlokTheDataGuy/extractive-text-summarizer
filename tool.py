import torch
import numpy as np
import os
from transformers import AutoTokenizer, AutoModel, BertModel, BertTokenizer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
from typing import List, Dict, Tuple
import re
import time
import argparse

class BERTSUMExtractiveTextSummarizer:
    def __init__(self, model_name: str = "bert-base-uncased", device: str = None):
        """
        Initialize the BERTSUM-style extractive summarizer.
        
        Args:
            model_name: The BERT model to use (default is bert-base-uncased)
            device: The device to use (cuda or cpu). If None, will use cuda if available.
        """
        # Set up device
        if device is None:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = torch.device(device)
            
        print(f"Using device: {self.device}")
        
        # Load BERT model and tokenizer
        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        self.model = BertModel.from_pretrained(model_name).to(self.device)
        
    def _split_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences.
        
        Args:
            text: The text to split into sentences
            
        Returns:
            A list of sentences
        """
        # Split text into sentences
        sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s', text)
        return [sentence.strip() for sentence in sentences if sentence.strip()]
    
    def _get_sentence_embeddings(self, sentences: List[str]) -> torch.Tensor:
        """
        Get BERT embeddings for each sentence.
        
        Args:
            sentences: List of sentences to embed
            
        Returns:
            Numpy array of sentence embeddings
        """
        embeddings = []
        
        # Process sentences in batches to avoid memory issues
        batch_size = 8
        for i in range(0, len(sentences), batch_size):
            batch = sentences[i:i+batch_size]
            
            # Tokenize sentences
            inputs = self.tokenizer(batch, padding=True, truncation=True, 
                                    max_length=512, return_tensors="pt").to(self.device)
            
            # Get embeddings - BERTSUM uses the [CLS] token embedding
            with torch.no_grad():
                outputs = self.model(**inputs)
                
            # Get the [CLS] token embedding for each sentence (BERTSUM approach)
            # The [CLS] token is at the beginning of each sentence
            cls_embeddings = outputs.last_hidden_state[:, 0, :].cpu().numpy()
            embeddings.extend(cls_embeddings)
                
        return np.array(embeddings)
    
    def _build_similarity_matrix(self, embeddings: np.ndarray) -> np.ndarray:
        """
        Build a similarity matrix between all sentences.
        
        Args:
            embeddings: Array of sentence embeddings
            
        Returns:
            Similarity matrix
        """
        # Compute cosine similarity between all sentence pairs
        return cosine_similarity(embeddings)
    
    def _rank_sentences(self, similarity_matrix: np.ndarray) -> List[int]:
        """
        Rank sentences using the TextRank algorithm (similar to BERTSUM approach).
        
        Args:
            similarity_matrix: Similarity matrix between sentences
            
        Returns:
            List of sentence indices sorted by importance
        """
        # Create a graph from the similarity matrix
        nx_graph = nx.from_numpy_array(similarity_matrix)
        
        # Apply PageRank to get sentence scores
        scores = nx.pagerank(nx_graph, alpha=0.85, max_iter=100)
        
        # Sort sentences by score in descending order
        ranked_sentences = sorted(((scores[i], i) for i in range(len(scores))), reverse=True)
        
        # Return indices of sentences in order of importance
        return [idx for _, idx in ranked_sentences]
    
    def summarize(self, text: str, ratio: float = 0.3, min_sentences: int = 3, max_sentences: int = 10) -> str:
        """
        Generate an extractive summary by selecting the most important sentences.
        
        Args:
            text: The text to summarize
            ratio: The proportion of sentences to include in the summary (0.0 to 1.0)
            min_sentences: Minimum number of sentences to include
            max_sentences: Maximum number of sentences to include
            
        Returns:
            The summary text
        """
        # Split text into sentences
        sentences = self._split_into_sentences(text)
        
        # If there are very few sentences, return the original text
        if len(sentences) <= min_sentences:
            return text
        
        # Get embeddings for each sentence
        embeddings = self._get_sentence_embeddings(sentences)
        
        # Build similarity matrix
        similarity_matrix = self._build_similarity_matrix(embeddings)
        
        # Rank sentences
        ranked_sentences = self._rank_sentences(similarity_matrix)
        
        # Determine number of sentences for the summary
        num_sentences = max(min_sentences, min(max_sentences, int(len(sentences) * ratio)))
        
        # Select the top sentences (by rank), but preserve original order
        selected_indices = sorted(ranked_sentences[:num_sentences])
        
        # Create summary by joining selected sentences
        summary = " ".join([sentences[idx] for idx in selected_indices])
        
        return summary
    
    def save_summary_to_file(self, summary: str, output_path: str):
        """
        Save the summary to a text file.
        
        Args:
            summary: The summary text
            output_path: Path where to save the summary
        """
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(summary)
        print(f"Summary saved to {output_path}")

def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description='BERTSUM-based extractive summarizer')
    parser.add_argument('--input', type=str, required=True, help='Input text file path')
    parser.add_argument('--output', type=str, default='summary.txt', help='Output summary file path')
    parser.add_argument('--ratio', type=float, default=0.3, help='Proportion of sentences to include (0.0-1.0)')
    parser.add_argument('--min', type=int, default=3, help='Minimum number of sentences')
    parser.add_argument('--max', type=int, default=10, help='Maximum number of sentences')
    args = parser.parse_args()
    
    # Read input text
    try:
        with open(args.input, 'r', encoding='utf-8') as f:
            text = f.read()
    except FileNotFoundError:
        print(f"Error: Input file '{args.input}' not found")
        return
    except Exception as e:
        print(f"Error reading input file: {e}")
        return
        
    # Initialize the summarizer
    start_time = time.time()
    summarizer = BERTSUMExtractiveTextSummarizer()
    print(f"Initialization time: {time.time() - start_time:.2f} seconds")
    
    # Generate summary
    start_time = time.time()
    summary = summarizer.summarize(text, ratio=args.ratio, min_sentences=args.min, max_sentences=args.max)
    print(f"Summarization time: {time.time() - start_time:.2f} seconds")
    
    # Save to output file
    summarizer.save_summary_to_file(summary, args.output)
    
    # Print summary preview
    print("\nSummary preview:")
    preview_length = min(200, len(summary))
    print(f"{summary[:preview_length]}{'...' if len(summary) > preview_length else ''}")
    print(f"\nFull summary saved to {args.output}")

if __name__ == "__main__":
    main()