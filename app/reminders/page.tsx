"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash, Calendar, Clock, Bell } from "lucide-react"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/utils"

interface Reminder {
  id: string
  title: string
  description: string
  date: string
  time: string
  isCompleted: boolean
  createdAt: string
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingReminder, setIsAddingReminder] = useState(false)
  const [isEditingReminder, setIsEditingReminder] = useState(false)
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  })

  useEffect(() => {
    const savedReminders = getFromLocalStorage("reminders") || []
    setReminders(savedReminders)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddReminder = () => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      ...formData,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    }

    const updatedReminders = [...reminders, newReminder]
    setReminders(updatedReminders)
    saveToLocalStorage("reminders", updatedReminders)

    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
    })

    setIsAddingReminder(false)
  }

  const handleEditReminder = () => {
    if (!currentReminder) return

    const updatedReminders = reminders.map((reminder) =>
      reminder.id === currentReminder.id ? { ...reminder, ...formData } : reminder,
    )

    setReminders(updatedReminders)
    saveToLocalStorage("reminders", updatedReminders)

    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
    })

    setIsEditingReminder(false)
    setCurrentReminder(null)
  }

  const handleDeleteReminder = (id: string) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id)
    setReminders(updatedReminders)
    saveToLocalStorage("reminders", updatedReminders)
  }

  const toggleReminderCompletion = (id: string) => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, isCompleted: !reminder.isCompleted } : reminder,
    )

    setReminders(updatedReminders)
    saveToLocalStorage("reminders", updatedReminders)
  }

  const startEditReminder = (reminder: Reminder) => {
    setCurrentReminder(reminder)
    setFormData({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date,
      time: reminder.time,
    })
    setIsEditingReminder(true)
  }

  const filteredReminders = reminders.filter(
    (reminder) =>
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort reminders by date
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reminders & Notes</h1>
          <p className="text-muted-foreground">Manage your reminders and notes</p>
        </div>
        <Button onClick={() => setIsAddingReminder(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Reminder
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search reminders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isAddingReminder && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Reminder</CardTitle>
            <CardDescription>Enter new reminder information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter reminder title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter reminder description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date">Date</label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <label htmlFor="time">Time</label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingReminder(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReminder}>Save</Button>
          </CardFooter>
        </Card>
      )}

      {isEditingReminder && currentReminder && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Reminder</CardTitle>
            <CardDescription>Update reminder information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-title">Title</label>
              <Input id="edit-title" name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-description">Description</label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-date">Date</label>
                <Input id="edit-date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-time">Time</label>
                <Input id="edit-time" name="time" type="time" value={formData.time} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsEditingReminder(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditReminder}>Save Changes</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedReminders.length > 0 ? (
          sortedReminders.map((reminder) => (
            <Card key={reminder.id} className={reminder.isCompleted ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className={`flex items-center gap-2 ${reminder.isCompleted ? "line-through" : ""}`}>
                    <Bell className="h-5 w-5" />
                    {reminder.title}
                  </CardTitle>
                  <input
                    type="checkbox"
                    checked={reminder.isCompleted}
                    onChange={() => toggleReminderCompletion(reminder.id)}
                    className="h-5 w-5"
                  />
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {reminder.date}
                  <Clock className="h-4 w-4 ml-2" />
                  {reminder.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${reminder.isCompleted ? "line-through" : ""}`}>{reminder.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => startEditReminder(reminder)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteReminder(reminder.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center py-10 text-muted-foreground">
            No reminders found. Add a new reminder.
          </p>
        )}
      </div>
    </div>
  )
}

