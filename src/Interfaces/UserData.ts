export interface User {
    _id: string;
    name: string;
    email: string;
    dateOfBirth: string;
    gender: "male" | "female";
    photo: string;
    createdAt: string;
}
