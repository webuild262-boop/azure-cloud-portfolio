FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir pandas azure-identity azure-storage-blob
COPY pipeline.py .
ENV PYTHONUNBUFFERED=1
CMD ["python", "pipeline.py"]
