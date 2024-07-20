# Makefile for Virtual Assistant Project

# Frontend commands
frontend:
	@echo "Starting frontend server..."
	cd frontend && npm start

# Backend commands
backend:
	@echo "Starting backend server..."
	cd backend && npm start

# Default command (start both frontend and backend)
start:
	@echo "Starting Virtual Assistant..."
	@make -s frontend & make -s backend

# Install dependencies for both frontend and backend
install:
	@echo "Installing dependencies..."
	@cd frontend && npm install
	@cd backend && npm install

# Clean dependencies (remove node_modules)
clean:
	@echo "Cleaning dependencies..."
	@cd frontend && rm -rf node_modules
	@cd backend && rm -rf node_modules

# Help command
help:
	@echo "Available commands:"
	@echo "  make install  : Install dependencies"
	@echo "  make start    : Start frontend and backend servers"
	@echo "  make frontend : Start frontend server"
	@echo "  make backend  : Start backend server"
	@echo "  make clean    : Clean dependencies (remove node_modules)"
	@echo "  make help     : Show this help message"

# Ensure these targets are not treated as file targets
.PHONY: frontend backend start install clean help
