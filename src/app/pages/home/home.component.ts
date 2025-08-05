import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TodoService, TodoItem } from '../../services/todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  providers: [TodoService]
})
export class HomeComponent implements OnInit {
  taskText: string = '';
  category: string = 'Work';  
  allTasks: TodoItem[] = [];
  selectedFilter: string = '';
  filterTab: string = 'all';
  filterCategory: string = 'All';
  sortFilter: string='date-desc';
  categories:string[] = [];
  showCategoryPopup: boolean = false;
  newCategory: string = '';
  showManageCategoryModal: boolean = false;
  showTaskPopup: boolean = false;
  selectedTask: TodoItem | null = null;
  editedText: string = '';
  editedCategory: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getTasks();
    this.getCategories();
  }

  openCategoryPopup() {
    this.showCategoryPopup = true;
  }

  closeCategoryPopup() {
    this.showCategoryPopup = false;
  }
  getCategories() {
    this.todoService.getCategories().subscribe((data) => {
        this.categories = data;
      });
  }

  addCategory() {
    if (this.newCategory.trim()) {
      this.todoService.addCategory(this.newCategory).subscribe({
        next: () => {
        this.getCategories();          
        this.newCategory = '';         
        this.closeCategoryPopup();     
      },
      error: (err) => {
        console.error('Add Category Failed:', err);
      }
      });
    }
  }
  
  addTask() {
      if (this.taskText.trim()) {
        const newTask: TodoItem = {
          id: 0, 
          todoText: this.taskText,
          category: this.category,
          completed: false,
          createdDateTime: new Date().toISOString() 
        };

        this.todoService.createTodo(newTask).subscribe({
          next: () => {
            this.taskText = '';
            this.getTasks(); 
          },
          error: (err) => {
            console.error('Error adding task:', err);
          }
        });
    }
  }

  getTasks() {
    this.todoService.getTodos().subscribe((data) => {
      this.allTasks = data.sort((a, b) => new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime());
      console.log("Tasks:", this.allTasks);
    });
  }

  getTotalTaskCount(): number {
    return this.allTasks.length;
  }

  toggleTask(task: TodoItem) {
    const updatedTask = { ...task, completed: !task.completed };
    this.todoService.updateTodo(task.id, updatedTask).subscribe(() => {
    this.getTasks();  
  });
  }

  deleteTask(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.getTasks();
    });
  }

  toggleCategoryFilter(filter: string){
    this.selectedFilter = filter;

     this.todoService.getTodos().subscribe((data) => {
      if(this.filterCategory === 'All'){
        this.allTasks = data
      }
      else{
        this.allTasks = data.filter(task => task.category === this.filterCategory);
    }
      console.log("Filtered Category data:", this.allTasks);
    });
    console.log('Filter changed to:', filter);
  }

  switchFilterTab(filterTab: string){
    this.filterTab = filterTab;

    this.todoService.getTodos().subscribe((data) => {
      switch(this.filterTab){
        case 'all': this.allTasks = data;break;
        case 'active':  this.allTasks = data.filter(task => task.completed === false);break;
        case 'completed': this.allTasks = data.filter(task => task.completed);break;
      }
      console.log("Tasks:", this.allTasks);
    });
    console.log('FilterTab changed to:', filterTab);
  }

  applySort(){
    switch (this.sortFilter) {
    case 'date-desc':
      this.allTasks.sort((a, b) => new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime());
      break;
    case 'date-asc':
      this.allTasks.sort((a, b) => new Date(a.createdDateTime).getTime() - new Date(b.createdDateTime).getTime());
      break;
    case 'atoz':
      this.allTasks.sort((a, b) => a.todoText.localeCompare(b.todoText));
      break;
    case 'ztoa':
      this.allTasks.sort((a, b) => b.todoText.localeCompare(a.todoText));
      break;
    case 'status':
      this.allTasks.sort((a, b) => Number(a.completed) - Number(b.completed)); // false (0) comes before true (1)
      break;
    case 'category':
      this.allTasks.sort((a, b) => a.category.localeCompare(b.category));
      break;
  }
  }


  openManageCategoryPopup() {
    this.getCategories();
    this.showManageCategoryModal = true;

  }

  closeManageCategoryPopup() {
    this.showManageCategoryModal = false;
  }

  deleteCategory(category: string){
      this.todoService.deleteCategory(category).subscribe({
        next: () => {
          console.log(`Deleted category: ${category}`);
          this.getCategories();
          // this.showManageCategoryModal = false;
        },
        error:(err) => {
          console.error('Failed to delete category:', err);
        }
      });
  }


  openTaskPopup(task: TodoItem){
    this.selectedTask = {...task };
    this.editedText = task.todoText;
    this.editedCategory = task.category;
    this.getCategories();

    this.showTaskPopup = true;
  }

  closeTaskPopup(){
    this.showTaskPopup = false;
    this.selectedTask = null;
  }
  updateTaskText(){
     if (this.selectedTask) {
    const updatedTask: TodoItem = {
      ...this.selectedTask,
      todoText: this.editedText,
      category: this.editedCategory
    };

    this.todoService.updateTodoTask(this.selectedTask.id, updatedTask).subscribe(() => {
      this.getTasks();
      this.closeTaskPopup();
    });
  }
  }

}
