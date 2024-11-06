import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../firebase.service';
import { FoodItem } from '../../food-item.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-foodplanner',
  standalone: true,  // Mark this component as standalone
  imports: [CommonModule, FormsModule],  // Add necessary imports
  templateUrl: './foodplanner.component.html',
  styleUrls: ['./foodplanner.component.scss'],
})
export class FoodPlannerComponent implements OnInit {
  foodItems: FoodItem[] = [];
  newFoodItem: FoodItem = { name: '', description: '', userId: '' };  // Removed 'quantity'
  userId: string = 'user123';  // Define userId as a class property

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    // Fetch food items for the logged-in user
    this.firebaseService.getFoodItems(this.userId).then((items) => {
      this.foodItems = items;
    });
  }

  addFoodItem(): void {
    if (this.newFoodItem.name) {
      this.newFoodItem.userId = this.userId;  // Use class-level userId
      this.firebaseService.addFoodItem(this.newFoodItem)
        .then(() => {
          this.foodItems.push(this.newFoodItem);
          this.newFoodItem = { name: '', description: '', userId: '' };  // Reset form
        });
    }
  }

  updateFoodItem(foodItem: FoodItem): void {
    this.firebaseService.updateFoodItem(foodItem.id!, foodItem)
      .then(() => {
        console.log("Food item updated successfully");
      });
  }

  deleteFoodItem(foodItemId: string): void {
    this.firebaseService.deleteFoodItem(foodItemId)
      .then(() => {
        this.foodItems = this.foodItems.filter(item => item.id !== foodItemId);
        console.log("Food item deleted");
      });
  }

  clearAllItems(): void {
    this.firebaseService.clearFoodItems(this.userId)  // Use class-level userId
      .then(() => {
        this.foodItems = [];
        console.log("All food items cleared");
      });
  }
}
