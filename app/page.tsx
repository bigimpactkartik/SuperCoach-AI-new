"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  BookOpen,
  Users,
  MessageCircle,
  Home,
  Plus,
  Search,
  Eye,
  X,
  Send,
  BarChart3,
  Award,
  Sparkles,
  Zap,
  Target,
  AlertCircle,
} from "lucide-react"

interface ApiStudent {
  id: number
  name: string
  email: string
  status: string
}

interface Student {
  id: number
  name: string
  email: string
  status: string
  progress: number
  lastActive: string
  courses: string[]
  completedTasks: number
  timeStudied: string
}

interface Course {
  id: number
  name: string
  description: string
  students: number
  progress: number
  version: string
}

interface ApiCourse {
  title: string
  description: string
  id: number
  created_at: string
  is_active: boolean
  version_id: number
  version: number
  module_count: number
  student_count: number
  completion_rate: number
}

// Add these new interfaces after the existing interfaces
interface TaskAssignment {
  id: number
  task_title: string
  status: string
  due_date: string | null
  completed_at: string | null
  module_title: string
}

interface Conversation {
  role: string
  message: string
  created_at: string
}

interface PointsHistory {
  transaction_type: string
  points: number
  task_id: number | null
}

interface StudentDetail {
  id: number
  name: string
  email: string
  phone: string
  telegram_id: string | null
  reward_points: number
  overall_progress: number
  status: string
  courses_enrolled: number
  task_assignments: TaskAssignment[]
  recent_conversations: Conversation[]
  points_history: PointsHistory[]
}

interface ChatMessage {
  id: number
  sender: string
  message: string
  timestamp: string
}

interface CoachData {
  id: number
  name: string
  email: string
}

interface ChatConversation {
  id: number
  student: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

// Mock data
const mockCourses: Course[] = [
  {
    id: 1,
    name: "React Fundamentals",
    description: "Learn the basics of React development.",
    students: 150,
    progress: 75,
    version: "v2.1",
  },
  {
    id: 2,
    name: "Node.js Mastery",
    description: "Become a Node.js expert.",
    students: 120,
    progress: 60,
    version: "v1.5",
  },
  {
    id: 3,
    name: "Advanced JavaScript",
    description: "Deep dive into JavaScript concepts.",
    students: 90,
    progress: 85,
    version: "v3.0",
  },
]

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.j@example.com",
    status: "Active",
    progress: 80,
    lastActive: "2 days ago",
    courses: ["React Fundamentals", "Advanced JavaScript"],
    completedTasks: 45,
    timeStudied: "35 hours",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.s@example.com",
    status: "In Progress",
    progress: 50,
    lastActive: "5 days ago",
    courses: ["Node.js Mastery"],
    completedTasks: 20,
    timeStudied: "20 hours",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    status: "Stuck",
    progress: 20,
    lastActive: "10 days ago",
    courses: ["React Fundamentals"],
    completedTasks: 5,
    timeStudied: "5 hours",
  },
]

const mockChatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "student",
    message:
      "Hi, I'm having trouble understanding the concept of components in React. Can you explain it in simpler terms?",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    sender: "coach",
    message:
      "Of course! Think of components as building blocks. Each block is responsible for rendering a part of the UI, and you can combine them to create complex interfaces.",
    timestamp: "2 hours ago",
  },
  {
    id: 3,
    sender: "student",
    message: "That makes sense! But how do I pass data between components?",
    timestamp: "1 hour ago",
  },
  {
    id: 4,
    sender: "coach",
    message:
      "You can pass data from a parent component to a child component using 'props'. It's like giving instructions or information to the child component.",
    timestamp: "1 hour ago",
  },
]

const mockConversations: ChatConversation[] = [
  {
    id: 1,
    student: "Alice Johnson",
    lastMessage: "Thanks for the explanation!",
    timestamp: "2 hours ago",
    unread: false,
  },
  {
    id: 2,
    student: "Bob Smith",
    lastMessage: "I'm still a bit confused about...",
    timestamp: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    student: "Charlie Brown",
    lastMessage: "Can we schedule a call?",
    timestamp: "1 day ago",
    unread: false,
  },
]

// Students Table Component
// Students Table Component
function StudentsTable() {
  const [students, setStudents] = useState<ApiStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Import the utility function
  // const { makeAuthenticatedRequest } = require("../lib/api");

  useEffect(() => {
    fetchStudents()
  }, [])

  // In the fetchStudents function, replace the entire function with:
  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Retrieve the access token from local storage
      const accessToken = localStorage.getItem("access_token")

      // Check if the token exists
      if (!accessToken) {
        throw new Error("Authentication token not found. Please log in.")
      }

      const response = await fetch("https://dfd0b0c67bcc.ngrok-free.app/api/students", {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          // 2. Add the Authorization header with the Bearer token
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStudents(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching students:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch students")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 shadow-green-500/50"
      case "inactive":
        return "bg-red-500 shadow-red-500/50"
      case "pending":
        return "bg-yellow-500 shadow-yellow-500/50"
      case "suspended":
        return "bg-orange-500 shadow-orange-500/50"
      default:
        return "bg-gray-500 shadow-gray-500/50"
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mr-3" />
          <span className="text-white text-lg">Loading students...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Students</h3>
          <p className="text-red-200 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchStudents}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300"
            >
              Try Again
            </motion.button>
            {/* No need for a separate Re-login button here, as the utility function handles it */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Students Dashboard</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchStudents}
          className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </motion.button>
      </div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
      >
        {/* Search Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">All Students ({filteredStudents.length})</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-blue-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? "No students found" : "No students available"}
            </h3>
            <p className="text-blue-200">
              {searchTerm ? "Try adjusting your search terms" : "Students will appear here when available"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-blue-200 font-semibold text-sm uppercase tracking-wider">Name</th>
                  <th className="text-left p-4 text-blue-200 font-semibold text-sm uppercase tracking-wider">Email</th>
                  <th className="text-left p-4 text-blue-200 font-semibold text-sm uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="hover:bg-white/5 transition-all duration-300 group"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-medium group-hover:text-blue-200 transition-colors duration-300">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-blue-200 group-hover:text-white transition-colors duration-300">
                        {student.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(student.status)} shadow-lg`}
                      >
                        {student.status}
                      </span>
                    </td>
                    {/* In the students section, replace the existing eye button onClick with: */}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// Courses Tab Component
function CoursesTab() {
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = localStorage.getItem("access_token")
      if (!accessToken) {
        throw new Error("Authentication token not found. Please log in.")
      }

      const response = await fetch("https://dfd0b0c67bcc.ngrok-free.app/api/dashboard/metrics", {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setCourses(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch courses")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mr-3" />
          <span className="text-white text-lg">Loading courses...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Courses</h3>
          <p className="text-red-200 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCourses}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Courses</h1>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCourses}
            className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Course
          </motion.button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-12 text-center">
          <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No courses available</h3>
          <p className="text-blue-200">Create your first course to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-blue-400" />
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-blue-200 bg-white/10 px-2 py-1 rounded-full">v{course.version}</span>
                  <span className={`w-2 h-2 rounded-full ${course.is_active ? "bg-green-500" : "bg-red-500"}`} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
              <p className="text-blue-200 mb-4 line-clamp-2">{course.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-200">Students</span>
                  <span className="text-white font-medium">{course.student_count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-200">Modules</span>
                  <span className="text-white font-medium">{course.module_count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-200">Completion Rate</span>
                  <span className="text-white font-medium">{course.completion_rate}%</span>
                </div>
              </div>

              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${course.completion_rate}%` }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-blue-300">
                <span>Created: {formatDate(course.created_at)}</span>
                <span
                  className={`px-2 py-1 rounded-full ${course.is_active ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
                >
                  {course.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Replace the existing StudentDetailModal with this new comprehensive version
// Student Detail Modal Component
function StudentDetailModal({
  studentId,
  onClose,
}: {
  studentId: number
  onClose: () => void
}) {
  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("journey")

  useEffect(() => {
    if (studentId) {
      fetchStudentDetail()
    }
  }, [studentId])

  const fetchStudentDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = localStorage.getItem("access_token")
      if (!accessToken) {
        throw new Error("Authentication token not found. Please log in.")
      }

      const response = await fetch(`https://dfd0b0c67bcc.ngrok-free.app/api/students/${studentId}`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStudentDetail(data)
    } catch (err) {
      console.error("Error fetching student detail:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch student details")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500 text-white"
      case "pending":
        return "bg-yellow-500 text-white"
      case "skipped":
        return "bg-red-500 text-white"
      case "in_progress":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "✓"
      case "pending":
        return "⏳"
      case "skipped":
        return "⏭"
      default:
        return "📝"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "earned":
        return "💰"
      case "bonus":
        return "🎁"
      case "deducted":
        return "💸"
      default:
        return "📊"
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mr-3" />
            <span className="text-white text-lg">Loading student details...</span>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Student</h3>
            <p className="text-red-200 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchStudentDetail}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300"
              >
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300"
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  if (!studentDetail) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {studentDetail.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{studentDetail.name}</h2>
                <p className="text-blue-200">{studentDetail.email}</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusColor(studentDetail.status)}`}
                >
                  {studentDetail.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-blue-200 hover:text-white transition-colors duration-300 p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{studentDetail.overall_progress}%</div>
              <div className="text-blue-200 text-sm">Overall Progress</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{studentDetail.reward_points}</div>
              <div className="text-blue-200 text-sm">Reward Points</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{studentDetail.courses_enrolled}</div>
              <div className="text-blue-200 text-sm">Courses Enrolled</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/20 bg-white/5">
          {[
            { id: "journey", label: "Task Completion", icon: Target },
            { id: "points", label: "Points History", icon: Award },
            { id: "conversations", label: "Conversations", icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center px-6 py-4 font-medium transition-all duration-300 ${
                activeSection === tab.id
                  ? "text-blue-400 border-b-2 border-blue-400 bg-white/10"
                  : "text-blue-200 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeSection === "journey" && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Task Completion</h3>
                {studentDetail.task_assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                    <h4 className="text-lg font-semibold text-white mb-2">No Tasks Assigned</h4>
                    <p className="text-blue-200">This student has no tasks assigned yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentDetail.task_assignments.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">{getStatusIcon(task.status)}</span>
                              <div>
                                <h4 className="text-white font-semibold">{task.task_title}</h4>
                                <p className="text-blue-200 text-sm">{task.module_title}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-blue-300">
                              <span>Due: {formatDate(task.due_date)}</span>
                              {task.completed_at && <span>Completed: {formatDateTime(task.completed_at)}</span>}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}
                          >
                            {task.status.toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === "points" && (
              <motion.div
                key="points"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Points History</h3>
                {studentDetail.points_history.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                    <h4 className="text-lg font-semibold text-white mb-2">No Points History</h4>
                    <p className="text-blue-200">This student has no points transactions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {studentDetail.points_history.map((point, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getTransactionIcon(point.transaction_type)}</span>
                            <div>
                              <h4 className="text-white font-semibold capitalize">
                                {point.transaction_type.replace("_", " ")}
                              </h4>
                              {point.task_id && <p className="text-blue-200 text-sm">Task ID: {point.task_id}</p>}
                            </div>
                          </div>
                          <div
                            className={`text-lg font-bold ${
                              point.transaction_type === "deducted" ? "text-red-400" : "text-green-400"
                            }`}
                          >
                            {point.transaction_type === "deducted" ? "-" : "+"}
                            {point.points}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === "conversations" && (
              <motion.div
                key="conversations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Recent Conversations</h3>
                {studentDetail.recent_conversations.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                    <h4 className="text-lg font-semibold text-white mb-2">No Conversations</h4>
                    <p className="text-blue-200">No conversation history available for this student.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentDetail.recent_conversations.map((conversation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${conversation.role === "agent" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-4 rounded-xl ${
                            conversation.role === "agent"
                              ? "bg-blue-500 text-white"
                              : "bg-white/20 text-white border border-white/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase opacity-75">{conversation.role}</span>
                            <span className="text-xs opacity-75">{formatDateTime(conversation.created_at)}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{conversation.message}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function SuperCoachAI() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [authTab, setAuthTab] = useState("login")
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", phone: "" })
  const [authError, setAuthError] = useState("")
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [coachData, setCoachData] = useState<CoachData | null>(null)
  const [showDemoInfo, setShowDemoInfo] = useState(false)
  // Add this state variable at the top of the SuperCoachAI component:
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthLoading(true)
    setAuthError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Store tokens in localStorage
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)
      localStorage.setItem("coach_data", JSON.stringify(data.coach))

      // Set coach data in state
      setCoachData(data.coach)

      // Navigate to dashboard
      setIsLoggedIn(true)
      setLoginForm({ email: "", password: "" })
      setAuthError("")
    } catch (error) {
      console.error("Login error:", error)
      setAuthError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("coach_data")
    setCoachData(null)
    setIsLoggedIn(false)
    setActiveTab("home")
  }

  // Check for existing session on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const accessToken = localStorage.getItem("access_token")
      const storedCoachData = localStorage.getItem("coach_data")

      if (accessToken && storedCoachData) {
        try {
          setCoachData(JSON.parse(storedCoachData))
          setIsLoggedIn(true)
        } catch (error) {
          console.error("Error parsing stored coach data:", error)
          // Clear invalid data
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("coach_data")
        }
      }
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500 shadow-blue-500/50"
      case "In Progress":
        return "bg-yellow-500 shadow-yellow-500/50"
      case "Stuck":
        return "bg-red-500 shadow-red-500/50"
      case "Completed":
        return "bg-green-500 shadow-green-500/50"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white">Loading SuperCoach AI...</h2>
        </motion.div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Demo Info Banner */}
        <AnimatePresence>
          {showDemoInfo && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500/90 backdrop-blur-lg text-white px-6 py-3 rounded-xl border border-blue-400/50 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Demo Mode</p>
                  <p className="text-sm">Use: demo@supercoach.ai / demo123</p>
                </div>
                <button onClick={() => setShowDemoInfo(false)} className="ml-4 text-white/80 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="flex min-h-screen">
          {/* Left Side - Hero Section */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col justify-center px-12 relative z-10"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center mb-8">
                <Brain className="w-12 h-12 text-blue-400 mr-4" />
                <h1 className="text-4xl font-bold text-white">SuperCoach AI</h1>
              </div>

              <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                Your AI-Powered
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Learning Companion
                </span>
              </h2>

              <p className="text-xl text-blue-200 mb-12">Transform Your Learning Journey with AI</p>

              <div className="space-y-6">
                {[
                  { icon: Zap, title: "AI-Powered Learning", desc: "Personalized coaching" },
                  { icon: Target, title: "Progress Tracking", desc: "Detailed analytics" },
                  { icon: Sparkles, title: "Interactive Content", desc: "Engaging modules" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                    className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                  >
                    <feature.icon className="w-8 h-8 text-blue-400 mr-4" />
                    <div>
                      <h3 className="text-white font-semibold">{feature.title}</h3>
                      <p className="text-blue-200 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex items-center justify-center px-12"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-full max-w-md"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                {/* Tab Headers */}
                <div className="flex mb-8 bg-white/10 rounded-xl p-1">
                  {["login", "register"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAuthTab(tab)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        authTab === tab ? "bg-blue-500 text-white shadow-lg" : "text-blue-200 hover:text-white"
                      }`}
                    >
                      {tab === "login" ? "Login" : "Register"}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={authTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {authTab === "login" ? (
                      <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            required
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <input
                            type="password"
                            placeholder="Password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            required
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                          />
                        </div>

                        {/* Demo credentials hint */}
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setShowDemoInfo(true)}
                            className="text-blue-300 hover:text-blue-200 text-sm underline transition-colors duration-300"
                          >
                            Need demo credentials?
                          </button>
                        </div>

                        {authError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {authError}
                          </motion.div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isAuthLoading}
                          className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAuthLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Signing In...
                            </div>
                          ) : (
                            "Sign In"
                          )}
                        </motion.button>
                      </form>
                    ) : (
                      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={registerForm.name}
                            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <input
                            type="password"
                            placeholder="Password"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={registerForm.phone}
                            onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                        >
                          Create Account
                        </motion.button>
                      </form>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-blue-400 mr-3" />
              <h1 className="text-xl font-bold text-white">SuperCoach AI</h1>
            </div>

            <div className="flex space-x-1 bg-white/10 rounded-xl p-1">
              {[
                { id: "home", icon: Home, label: "Home" },
                { id: "courses", icon: BookOpen, label: "Courses" },
                { id: "students", icon: Users, label: "Students" },
               // { id: "conversations", icon: MessageCircle, label: "Conversations" },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-blue-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {coachData && (
                <div className="text-right">
                  <div className="text-white font-medium">{coachData.name}</div>
                  <div className="text-blue-200 text-sm">{coachData.email}</div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-blue-200 hover:text-white transition-colors duration-300 px-3 py-1 rounded-lg hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StudentsTable />
            </motion.div>
          )}

          {activeTab === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CoursesTab />
            </motion.div>
          )}

          {activeTab === "students" && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Students</h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Student
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {student.name.charAt(0)}
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(student.status)} shadow-lg`}
                      >
                        {student.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{student.name}</h3>
                    <p className="text-blue-200 mb-4">{student.email}</p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-200">Progress</span>
                        <span className="text-sm text-white font-medium">{student.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${student.progress}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-200">Last active: {student.lastActive}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        // In the students section, replace the existing eye button onClick with:
                        onClick={() => setSelectedStudentId(student.id)}
                        className="p-2 bg-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-all duration-300"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "conversations" && (
            <motion.div
              key="conversations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-200px)]"
            >
              //<h1 className="text-3xl font-bold text-white mb-8">Conversations</h1>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Conversations List */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                  <div className="p-4 border-b border-white/20">
                    <h2 className="text-lg font-semibold text-white">Messages</h2>
                  </div>
                  <div className="overflow-y-auto h-full">
                    {mockConversations.map((conversation, index) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-4 border-b border-white/10 cursor-pointer transition-all duration-300 ${
                          selectedConversation?.id === conversation.id ? "bg-white/10" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">{conversation.student}</h3>
                          {conversation.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-blue-200 text-sm truncate">{conversation.lastMessage}</p>
                        <p className="text-blue-300 text-xs mt-1">{conversation.timestamp}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Chat Panel */}
                <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 flex flex-col">
                  {selectedConversation ? (
                    <>
                      <div className="p-4 border-b border-white/20">
                        <h2 className="text-lg font-semibold text-white">{selectedConversation.student}</h2>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {mockChatMessages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className={`flex ${message.sender === "coach" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                                message.sender === "coach" ? "bg-blue-500 text-white" : "bg-white/20 text-white"
                              }`}
                            >
                              <p>{message.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender === "coach" ? "text-blue-100" : "text-blue-200"
                                }`}
                              >
                                {message.timestamp}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="p-4 border-t border-white/20">
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all duration-300"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 bg-blue-500 rounded-xl text-white hover:bg-blue-600 transition-all duration-300"
                          >
                            <Send className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                        <p className="text-blue-200">Choose a student to start chatting</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Add Course Modal */}
        {showAddCourseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddCourseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add New Course</h2>
                <button
                  onClick={() => setShowAddCourseModal(false)}
                  className="text-blue-200 hover:text-white transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Course Name"
                    className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Course Description"
                    rows={3}
                    className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all duration-300 resize-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Version (e.g., v1.0)"
                    className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddCourseModal(false)}
                    className="flex-1 p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                  >
                    Create Course
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        {/* Add Student Modal */}
        {showAddStudentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddStudentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add New Student</h2>
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="text-blue-200 hover:text-white transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Student Name"
                    className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  />
                </div>
                <div>
                  <select className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-all duration-300">
                    <option value="" className="bg-slate-800">
                      Select Course
                    </option>
                    {mockCourses.map((course) => (
                      <option key={course.id} value={course.id} className="bg-slate-800">
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="flex-1 p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                  >
                    Add Student
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        // Replace the existing Student Detail Drawer modal with:
        {selectedStudentId && (
          <StudentDetailModal studentId={selectedStudentId} onClose={() => setSelectedStudentId(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
