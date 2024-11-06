export class FoodItem {
  id?: string;  // Firestore document ID (optional, for Firebase use)
  name: string;
  description: string;
  userId: string;  // The user who added the item

  constructor(
    name: string,
    description: string,
    userId: string,
    id?: string
  ) {
    this.name = name;
    this.description = description;
    this.userId = userId;
    if (id) {
      this.id = id;
    }
  }
}
