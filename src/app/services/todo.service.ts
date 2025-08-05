import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

export interface TodoItem {
  id: number;
  todoText: string;
  category: string;
  completed: boolean;
  createdDateTime: string;
}


const headers = new HttpHeaders({
  'x-api-key': 'nHiSYz4MZMLotDsTjUyJYCNvhbodUT18'
});

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  

  private apiUrl= 'http://localhost:5229/api/todo';

  constructor(private http: HttpClient) { }

  getCategories(){
    return this.http.get<string[]>(this.apiUrl+'/categories', { headers });
  }

  createTodo(todo: TodoItem) {
    return this.http.post<TodoItem>(this.apiUrl, todo, { headers });
  }


  getTodos(){
    return this.http.get<TodoItem[]>(this.apiUrl, { headers });
  }


  deleteTodo(id: number) {
    return this.http.delete(this.apiUrl + `/${id}`, { headers });
  }

  updateTodo(id: number,task: TodoItem){
    return this.http.put<TodoItem>(`${this.apiUrl}/${id}`, task, { headers });
  }

 addCategory(category: string) {
  return this.http.post<string[]>(`${this.apiUrl}/addCategories`,
    { newCategory: category },  
    { headers: { 'Content-Type': 'application/json','x-api-key': 'nHiSYz4MZMLotDsTjUyJYCNvhbodUT18' } }
  );
}

deleteCategory(category: string){
  // let check = `${this.apiUrl}/category/${encodeURIComponent(category)}`;
  return this.http.delete(`${this.apiUrl}/category/${encodeURIComponent(category)}`, {headers});
}

updateTodoTask(id: number, updatedTask: TodoItem) {
  return this.http.put<TodoItem>(`${this.apiUrl}/UpdateTodoTask/${id}`, updatedTask, { headers }  );
}

}
