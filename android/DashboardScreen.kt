package com.aksharadeepa.tutor.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aksharadeepa.tutor.ui.theme.OrangePrimary
import com.aksharadeepa.tutor.ui.theme.Slate900

@Composable
fun DashboardScreen(
    name: String,
    points: Int,
    streak: Int,
    progress: Float,
    onNavigateToTutor: () -> Unit,
    onNavigateToQuiz: () -> Unit
) {
    Scaffold(
        bottomBar = { /* Implement Bottom Navigation here */ }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(24.dp))
                HeaderSection(name, points, streak)
            }

            item {
                MissionCard(progress)
            }

            item {
                QuickActions(onNavigateToTutor, onNavigateToQuiz)
            }

            item {
                PerformanceSection()
            }
        }
    }
}

@Composable
fun HeaderSection(name: String, points: Int, streak: Int) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        alignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .background(
                        brush = Brush.linearGradient(listOf(Color(0xFF6366F1), Color(0xFFA855F7))),
                        shape = RoundedCornerShape(20.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = name.take(1).uppercase(),
                    color = Color.White,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black
                )
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = "Hi, $name!",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Black
                )
                Row(modifier = Modifier.padding(top = 4.dp)) {
                    BadgeChip("🔥 $streak Day Streak", Color(0xFFFFEDD5), Color(0xFFEA580C))
                    Spacer(modifier = Modifier.width(8.dp))
                    BadgeChip("⚡ $points XP", Color(0xFFE0E7FF), Color(0xFF4F46E5))
                }
            }
        }
    }
}

@Composable
fun BadgeChip(text: String, bgColor: Color, textColor: Color) {
    Surface(
        color = bgColor,
        shape = RoundedCornerShape(full = true)
    ) {
        Text(
            text = text,
            color = textColor,
            fontSize = 10.sp,
            fontWeight = FontWeight.Black,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}

@Composable
fun MissionCard(progress: Float) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(180.dp),
        shape = RoundedCornerShape(32.dp),
        colors = CardDefaults.cardColors(containerColor = Slate900)
    ) {
        Box(modifier = Modifier.fillMaxSize().padding(24.dp)) {
            Column(modifier = Modifier.align(Alignment.TopStart)) {
                Text(
                    "QUEST PROGRESS",
                    color = Color.White.copy(alpha = 0.6f),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Black
                )
                Text(
                    "Master the Syllabus",
                    color = Color.White,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black
                )
            }
            
            Column(modifier = Modifier.align(Alignment.BottomStart).fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("${(progress * 100).toInt()}% COMPLETED", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp)
                    Text("Level 5", color = Color.White, fontWeight = FontWeight.Black)
                }
                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = progress,
                    modifier = Modifier.fillMaxWidth().height(8.dp),
                    color = OrangePrimary,
                    trackColor = Color.White.copy(alpha = 0.1f),
                    strokeCap = androidx.compose.ui.graphics.StrokeCap.Round
                )
            }
        }
    }
}

@Composable
fun QuickActions(onNavigateToTutor: () -> Unit, onNavigateToQuiz: () -> Unit) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
        ActionButton(
            title = "AI\nTutor",
            color = Color(0xFF6366F1),
            modifier = Modifier.weight(1f),
            onClick = onNavigateToTutor
        )
        ActionButton(
            title = "Quick\nQuiz",
            color = Color.White,
            textColor = Slate900,
            modifier = Modifier.weight(1f),
            onClick = onNavigateToQuiz,
            border = true
        )
    }
}

@Composable
fun ActionButton(title: String, color: Color, modifier: Modifier, onClick: () -> Unit, textColor: Color = Color.White, border: Boolean = false) {
    Button(
        onClick = onClick,
        modifier = modifier.height(120.dp),
        shape = RoundedCornerShape(32.dp),
        colors = ButtonDefaults.buttonColors(containerColor = color),
        border = if (border) BorderStroke(1.dp, Color(0xFFF1F5F9)) else null,
        contentPadding = PaddingValues(20.dp)
    ) {
        Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.Bottom) {
            Text(title, color = textColor, fontWeight = FontWeight.Black, lineHeight = 20.sp, fontSize = 16.sp)
        }
    }
}

@Composable
fun PerformanceSection() {
    // Implement Chart using a library like ComposeCharts or manual Canvas
    Text("PEFORMANCE CHART", fontWeight = FontWeight.Black, fontSize = 12.sp, color = Color.Gray)
    Box(modifier = Modifier.fillMaxWidth().height(150.dp).background(Color.White, RoundedCornerShape(32.dp))) {
        Text("Chart Illustration", modifier = Modifier.align(Alignment.Center), color = Color.LightGray)
    }
}
