"""
Простой демонстрационный бэкенд для Task Tracker.
Хранит задачи в памяти (перезапуск сервера = сброс данных).

Запуск:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Swagger UI:      http://localhost:8000/docs
OpenAPI JSON:    http://localhost:8000/openapi.json  <- на него смотрит hey-api
"""

import uuid
from datetime import datetime
from enum import Enum

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Task Tracker API",
    version="1.0.0",
    description="Демо-бэкенд для CRUD задач, используется для тренировки axios + hey-api",
)

# Разрешаем запросы с dev-сервера Vite (по умолчанию порт 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Status(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    priority: Priority = Priority.medium
    status: Status = Status.todo


class TaskCreate(TaskBase):
    """Тело запроса на создание задачи."""


class TaskUpdate(TaskBase):
    """Тело запроса на полное обновление задачи (PUT)."""


class Task(TaskBase):
    id: str
    created_at: datetime


# --- "база данных" в памяти ---
tasks_db: dict[str, Task] = {}


def seed() -> None:
    demo = [
        TaskCreate(title="Настроить бэкенд", description="FastAPI + CORS + Swagger", priority=Priority.high, status=Status.done),
        TaskCreate(title="Подключить hey-api", description="Генерация типов из OpenAPI", priority=Priority.medium, status=Status.in_progress),
        TaskCreate(title="Написать axios-сервис", description="GET/POST/PUT/DELETE во фронтенде", priority=Priority.low, status=Status.todo),
    ]
    for item in demo:
        task_id = str(uuid.uuid4())
        tasks_db[task_id] = Task(id=task_id, created_at=datetime.utcnow(), **item.model_dump())


seed()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/tasks", response_model=list[Task], summary="Список всех задач", operation_id="listTasks")
def list_tasks() -> list[Task]:
    return list(tasks_db.values())


@app.get("/tasks/{task_id}", response_model=Task, summary="Получить задачу по id", operation_id="getTask")
def get_task(task_id: str) -> Task:
    task = tasks_db.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.post("/tasks", response_model=Task, status_code=201, summary="Создать задачу", operation_id="createTask")
def create_task(payload: TaskCreate) -> Task:
    task_id = str(uuid.uuid4())
    task = Task(id=task_id, created_at=datetime.utcnow(), **payload.model_dump())
    tasks_db[task_id] = task
    return task


@app.put("/tasks/{task_id}", response_model=Task, summary="Полностью обновить задачу", operation_id="updateTask")
def update_task(task_id: str, payload: TaskUpdate) -> Task:
    existing = tasks_db.get(task_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Task not found")
    updated = Task(id=task_id, created_at=existing.created_at, **payload.model_dump())
    tasks_db[task_id] = updated
    return updated


@app.delete("/tasks/{task_id}", status_code=204, summary="Удалить задачу", operation_id="deleteTask")
def delete_task(task_id: str) -> None:
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    del tasks_db[task_id]
