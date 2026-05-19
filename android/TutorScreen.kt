package com.aksharadeepa.tutor.ui.tutor

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class Message(val text: String, val isUser: Boolean)

@Composable
fun TutorScreen(
    messages: List<Message>,
    onSendMessage: (String) -> Unit,
    onStartVoice: () -> Unit
) {
    var textInput by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFFF8FAFC))) {
        // Top Header
        Surface(
            modifier = Modifier.fillMaxWidth().height(100.dp),
            color = Color.White,
            shadowElevation = 4.dp
        ) {
            Row(
                modifier = Modifier.padding(20.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(modifier = Modifier.size(48.dp).background(Color(0xFF6366F1), RoundedCornerShape(16.dp)))
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text("Deepa AI", fontWeight = FontWeight.Black, fontSize = 18.sp)
                    Text("ONLINE", color = Color(0xFF10B981), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Messages List
        LazyColumn(
            modifier = Modifier.weight(1f).padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(messages) { msg ->
                ChatBubble(msg)
            }
        }

        // Input Area
        Surface(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            shape = RoundedCornerShape(24.dp),
            color = Color.White,
            shadowElevation = 8.dp
        ) {
            Row(
                modifier = Modifier.padding(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onStartVoice) {
                    Icon(Icons.Default.Mic, contentDescription = "Voice", tint = Color.Gray)
                }
                TextField(
                    value = textInput,
                    onValueChange = { textInput = it },
                    placeholder = { Text("Ask your tutor...") },
                    modifier = Modifier.weight(1f),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Color.Transparent,
                        unfocusedContainerColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent
                    )
                )
                IconButton(
                    onClick = { 
                        if (textInput.isNotBlank()) {
                            onSendMessage(textInput)
                            textInput = ""
                        }
                    },
                    modifier = Modifier.background(Color(0xFF6366F1), RoundedCornerShape(12.dp))
                ) {
                    Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White)
                }
            }
        }
    }
}

@Composable
fun ChatBubble(message: Message) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (message.isUser) Alignment.End else Alignment.Start
    ) {
        Surface(
            color = if (message.isUser) Color(0xFF0F172A) else Color(0xFFF1F5F9),
            shape = RoundedCornerShape(
                topStart = 20.dp,
                topEnd = 20.dp,
                bottomStart = if (message.isUser) 20.dp else 4.dp,
                bottomEnd = if (message.isUser) 4.dp else 20.dp
            )
        ) {
            Text(
                text = message.text,
                modifier = Modifier.padding(16.dp),
                color = if (message.isUser) Color.White else Color(0xFF1E293B),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                lineHeight = 20.sp
            )
        }
    }
}
