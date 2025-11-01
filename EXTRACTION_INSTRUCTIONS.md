# PDF Data Extraction Instructions

## Environment
- Use conda environment: `wsc`
- Python path: `/Users/walters/miniforge3/envs/wsc/bin/python`
- Python version: 3.10

## Required Packages
Install in the wsc conda environment:
```bash
/Users/walters/miniforge3/envs/wsc/bin/pip install PyPDF2
```

## Extraction Scripts

### 1. Children's Catechism Extraction
- Script: `extract_childrens.py`
- Input: `Childrens_Catechism.pdf` (145 questions)
- Output: `src/children/data.json`
- Format: Simple Q&A pairs with id, question, answer

### 2. Shorter Catechism Extraction
- Script: `extract_shorter.py` (to be created)
- Input: `Shorter_Catechism.pdf` (107 questions)
- Output: `src/shorter/data.json`
- Format: Q&A with scripture references and proof texts

## Run Commands
```bash
# From catechism directory:
/Users/walters/miniforge3/envs/wsc/bin/python extract_childrens.py
/Users/walters/miniforge3/envs/wsc/bin/python extract_shorter.py
```
