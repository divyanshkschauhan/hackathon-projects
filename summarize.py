from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
from transformers import T5Tokenizer, T5ForConditionalGeneration
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the frontend

# Load the pretrained T5 model for summarization
print("Loading summarization model...")
model = T5ForConditionalGeneration.from_pretrained("t5-base")
tokenizer = T5Tokenizer.from_pretrained("t5-base")
print("Model loaded successfully.")

def extract_text_from_pdf(pdf_file):
    """Extracts text from the uploaded PDF."""
    try:
        pdf_reader = PdfReader(pdf_file)
        extracted_text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text += page_text
        return extracted_text
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return None

def summarize_text(text, max_length=512):
    """Summarizes the extracted text using the T5 model."""
    try:
        print("Summarizing text...")
        input_text = "summarize: " + text
        input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=1024, truncation=True)
        summary_ids = model.generate(input_ids, max_length=max_length, min_length=100, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return summary
    except Exception as e:
        print(f"Error summarizing text: {str(e)}")
        return None

@app.route('/summarize', methods=['POST'])
def summarize():
    """Endpoint to upload a PDF and return a summarized text."""
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400

    file = request.files['pdf']
    
    # Extract text from the PDF
    extracted_text = extract_text_from_pdf(file)
    if not extracted_text:
        return jsonify({"error": "Failed to extract text from the PDF"}), 500
    
    # Summarize the extracted text
    summary = summarize_text(extracted_text)
    if not summary:
        return jsonify({"error": "Failed to summarize the text"}), 500

    return jsonify({"summary": summary})

if __name__ == '__main__':
    app.run(debug=True)
