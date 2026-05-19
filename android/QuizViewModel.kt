package com.aksharadeepa.tutor.ui.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class QuizUiState(
    val currentQuestionIndex: Int = 0,
    val score: Int = 0,
    val timeLeft: Int = 60,
    val isFinished: Boolean = false,
    val isLoading: Boolean = false
)

class QuizViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(QuizUiState())
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    init {
        startTimer()
    }

    private fun startTimer() {
        viewModelScope.launch {
            while (_uiState.value.timeLeft > 0 && !_uiState.value.isFinished) {
                delay(1000)
                _uiState.value = _uiState.value.copy(timeLeft = _uiState.value.timeLeft - 1)
            }
            if (_uiState.value.timeLeft == 0) {
                finishQuiz()
            }
        }
    }

    fun onOptionSelected(isCorrect: Boolean) {
        val newScore = if (isCorrect) _uiState.value.score + 1 else _uiState.value.score
        val nextIndex = _uiState.value.currentQuestionIndex + 1
        
        // Assuming 5 questions per quiz
        if (nextIndex >= 5) {
            _uiState.value = _uiState.value.copy(score = newScore)
            finishQuiz()
        } else {
            _uiState.value = _uiState.value.copy(
                score = newScore,
                currentQuestionIndex = nextIndex
            )
        }
    }

    private fun finishQuiz() {
        _uiState.value = _uiState.value.copy(isFinished = true)
        // Here you would save the result to Room DB
    }
}
