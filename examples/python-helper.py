#!/usr/bin/env python3
"""
Python Helper Module
Can be called from Verion Language code
"""

import json
import sys

def greet(name):
    """Greet a person"""
    return f"Hello from Python, {name}!"

def calculate(operation, a, b):
    """Perform calculations"""
    operations = {
        'add': a + b,
        'subtract': a - b,
        'multiply': a * b,
        'divide': a / b if b != 0 else None,
        'power': a ** b
    }
    return operations.get(operation, None)

def process_list(numbers):
    """Process a list of numbers"""
    return {
        'sum': sum(numbers),
        'average': sum(numbers) / len(numbers) if numbers else 0,
        'min': min(numbers) if numbers else None,
        'max': max(numbers) if numbers else None,
        'sorted': sorted(numbers)
    }

def analyze_text(text):
    """Analyze text"""
    words = text.split()
    return {
        'character_count': len(text),
        'word_count': len(words),
        'unique_words': len(set(words)),
        'uppercase_count': sum(1 for c in text if c.isupper()),
        'lowercase_count': sum(1 for c in text if c.islower())
    }

if __name__ == "__main__":
    # CLI interface for calling from VL
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "greet":
            name = sys.argv[2] if len(sys.argv) > 2 else "World"
            print(json.dumps(greet(name)))
        
        elif command == "calculate":
            operation = sys.argv[2]
            a = float(sys.argv[3])
            b = float(sys.argv[4])
            result = calculate(operation, a, b)
            print(json.dumps(result))
        
        elif command == "process_list":
            numbers = json.loads(sys.argv[2])
            result = process_list(numbers)
            print(json.dumps(result))
        
        elif command == "analyze_text":
            text = sys.argv[2]
            result = analyze_text(text)
            print(json.dumps(result))
    else:
        print("Python helper module loaded")
