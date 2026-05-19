# Akshara-Deepa Tutor: Android Architecture Guide

For a production-grade educational app like Akshara-Deepa, we recommend **MVVM (Model-View-ViewModel)** combined with **Clean Architecture** principles.

## 1. Project Layers

### **Data Layer**
- **Repositories**: Handle data sourcing (Room DB for offline-first, Gemini API for AI).
- **Room Database**: Stores syllabus progress, local quiz results, and user profile.
- **Retrofit/Ktor**: Handles API calls to the Gemini backend.

### **Domain Layer** (Optional but recommended for scale)
- **UseCases**: Business logic like `UpdateChapterProgressUseCase`, `CalculateStudyStreakUseCase`.
- **Entities**: Pure Kotlin data classes representing the core business models.

### **Presentation Layer**
- **ViewModels**: Manage UI state using `StateFlow` or `MutableState`.
- **Compose Screens**: Declarative UI components using Jetpack Compose and Material Design 3.
- **Navigation**: Using `Navigation Compose` to handle route transitions.

## 2. Tech Stack Recommendations
- **Language**: Kotlin
- **UI**: Jetpack Compose
- **Async**: Coroutines & Flow
- **Dependency Injection**: Hilt (Standard for Android)
- **Database**: Room
- **AI**: Google AI SDK for Android (Gemini)

## 3. Directory Structure
```text
com.aksharadeepa.tutor/
├── data/
│   ├── local/ (Room entities, DAOs, Database)
│   ├── remote/ (API interfaces, DTOs)
│   └── repository/ (Repository implementations)
├── domain/
│   ├── model/ (Entities)
│   └── usecase/ (Business logic)
├── ui/
│   ├── components/ (Common UI components)
│   ├── theme/ (Color, Type, Shape)
│   ├── dashboard/ (DashboardScreen & ViewModel)
│   ├── quiz/ (QuizScreen & ViewModel)
│   └── tutor/ (AI Tutor screens)
└── MainActivity.kt
```

## 4. Key Implementation Patterns

### **ViewModel State**
Use a `sealed class` for UI states:
```kotlin
sealed class DashboardUiState {
    object Loading : DashboardUiState()
    data class Success(val profile: UserProfile, val progress: Int) : DashboardUiState()
    data class Error(val message: String) : DashboardUiState()
}
```

### **Theme Customization (Modern Design)**
Use `MaterialTheme` color schemes with gradients for the "modern" look. Define your custom shapes in `Shape.kt` for the 40dp rounded corners implemented in the web redesign.
