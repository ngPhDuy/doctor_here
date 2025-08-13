# # Use Python 3.11 as the base image
# FROM python:3.11-slim

# # Set the working directory inside the container
# WORKDIR /app

# # Install system dependencies
# RUN apt-get update && apt-get install -y build-essential

# # Copy the requirements.txt file into the container
# COPY requirements.txt .

# # Install the required Python packages
# RUN pip install --no-cache-dir --timeout=600 -r requirements.txt

# # Copy the rest of the project files into the container
# COPY . .

# # Change directory to llm_engine and run the generate_vectorstore.py script
# WORKDIR /app/llm_engine
# RUN python generate_vectorstore.py

# # Expose the port that the application will run on
# EXPOSE 8001

# # Set the environment variable to use the virtual environment
# # (not needed in this case as we're not using a virtual environment)

# # Set the working directory back to the main project directory
# WORKDIR /app

# # Start the application using uvicorn
# CMD ["uvicorn", "server.main:app", "--reload", "--port", "8001"]

# Sử dụng image Python 3.11 làm base image
FROM python:3.11-slim

# Cài đặt các thư viện hệ thống cần thiết
RUN apt-get update && apt-get install -y build-essential

# Đặt thư mục làm việc là thư mục gốc của dự án
WORKDIR /doctor_here/ai_agent

# Sao chép file requirements.txt vào container
COPY requirements.txt .

# Cài đặt các thư viện Python từ requirements.txt
RUN pip install --no-cache-dir --timeout=600 -r requirements.txt

# Sao chép toàn bộ mã nguồn vào container (bao gồm thư mục llm_engine, models, v.v.)
COPY . .

# Thay đổi thư mục làm việc đến llm_engine và chạy script generate_vectorstore.py
WORKDIR /doctor_here/ai_agent/llm_engine
RUN python generate_vectorstore.py

# Mở cổng 8001 để ứng dụng có thể truy cập
EXPOSE 8001

# Đặt lại thư mục làm việc về ai-agent-26-7
WORKDIR /doctor_here/ai_agent

# Chạy ứng dụng FastAPI bằng uvicorn
CMD ["uvicorn", "server.main:app", "--reload", "--host", "0.0.0.0", "--port", "8001"]

