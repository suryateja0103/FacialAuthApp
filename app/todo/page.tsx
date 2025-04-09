"use client"

import type React from "react"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, MessageSquare } from "lucide-react"

type JiraIssue = {
  id: string
  title: string
  description: string
  status: "TO DO" | "IN PROGRESS" | "DONE"
  assignee?: string
}

export const dynamic = "force-dynamic"

function JiraBoard() {
  const searchParams = useSearchParams()
  const userId = `${searchParams.get("firstName")}.${searchParams.get("lastName")}`

  const [issues, setIssues] = useState<JiraIssue[]>([])
  const [newIssueTitle, setNewIssueTitle] = useState("")
  const [newIssueDescription, setNewIssueDescription] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [currentIssue, setCurrentIssue] = useState<JiraIssue | null>(null)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Record<string, string[]>>({})
  const [draggedIssue, setDraggedIssue] = useState<JiraIssue | null>(null)

  const todoColumnRef = useRef<HTMLDivElement>(null)
  const inProgressColumnRef = useRef<HTMLDivElement>(null)
  const doneColumnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(`jira-issues-${userId}`)
    const storedComments = localStorage.getItem(`jira-comments-${userId}`)

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setIssues(parsed)
          return
        }
      } catch (err) {
        console.error("Error parsing issues from localStorage", err)
      }
    }

    if (storedComments) {
      try {
        const parsed = JSON.parse(storedComments)
        setComments(parsed)
      } catch (err) {
        console.error("Error parsing comments from localStorage", err)
      }
    }

    const predefined: JiraIssue[] = [
      { id: "SCRUM-1", title: "Check-in at front desk", description: "Verify identity at reception", status: "TO DO" },
      {
        id: "SCRUM-2",
        title: "Complete facial authentication",
        description: "Use the facial recognition system to authenticate",
        status: "TO DO",
      },
      {
        id: "SCRUM-3",
        title: "Collect safety gear",
        description: "Get required PPE from the safety office",
        status: "IN PROGRESS",
      },
      {
        id: "SCRUM-4",
        title: "Review work assignments",
        description: "Check daily tasks and assignments",
        status: "DONE",
      },
    ]
    setIssues(predefined)
    localStorage.setItem(`jira-issues-${userId}`, JSON.stringify(predefined))
  }, [userId])

  useEffect(() => {
    localStorage.setItem(`jira-issues-${userId}`, JSON.stringify(issues))
  }, [issues, userId])

  useEffect(() => {
    localStorage.setItem(`jira-comments-${userId}`, JSON.stringify(comments))
  }, [comments, userId])

  const addIssue = () => {
    if (!newIssueTitle.trim()) return

    const newIssue: JiraIssue = {
      id: `SCRUM-${issues.length + 1}`,
      title: newIssueTitle,
      description: newIssueDescription,
      status: "TO DO",
      assignee: userId,
    }

    setIssues([...issues, newIssue])
    setNewIssueTitle("")
    setNewIssueDescription("")
    setIsDialogOpen(false)
  }

  const updateIssueStatus = (id: string, newStatus: "TO DO" | "IN PROGRESS" | "DONE") => {
    setIssues(issues.map((issue) => (issue.id === id ? { ...issue, status: newStatus } : issue)))
  }

  const addComment = () => {
    if (!currentIssue || !comment.trim()) return

    const issueId = currentIssue.id
    const issueComments = comments[issueId] || []

    setComments({
      ...comments,
      [issueId]: [...issueComments, comment],
    })

    setComment("")
    setCommentDialogOpen(false)
  }

  const handleDragStart = (issue: JiraIssue) => {
    setDraggedIssue(issue)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: "TO DO" | "IN PROGRESS" | "DONE") => {
    if (draggedIssue) {
      updateIssueStatus(draggedIssue.id, status)
      setDraggedIssue(null)
    }
  }

  const openCommentDialog = (issue: JiraIssue) => {
    setCurrentIssue(issue)
    setCommentDialogOpen(true)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Hello {userId}, your Jira Board</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Issue
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TO DO Column */}
        <div
          ref={todoColumnRef}
          className="bg-gray-50 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("TO DO")}
        >
          <h2 className="font-semibold mb-3 text-gray-700 flex items-center">
            TO DO{" "}
            <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {issues.filter((i) => i.status === "TO DO").length}
            </span>
          </h2>
          <div className="space-y-3">
            {issues
              .filter((issue) => issue.status === "TO DO")
              .map((issue) => (
                <Card key={issue.id} className="cursor-move" draggable onDragStart={() => handleDragStart(issue)}>
                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between">
                      <span className="text-xs text-blue-600 font-mono">{issue.id}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => openCommentDialog(issue)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        {comments[issue.id] && comments[issue.id].length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {comments[issue.id].length}
                          </span>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <CardTitle className="text-sm font-medium">{issue.title}</CardTitle>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{issue.description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div
          ref={inProgressColumnRef}
          className="bg-gray-50 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("IN PROGRESS")}
        >
          <h2 className="font-semibold mb-3 text-gray-700 flex items-center">
            IN PROGRESS{" "}
            <span className="ml-2 bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs">
              {issues.filter((i) => i.status === "IN PROGRESS").length}
            </span>
          </h2>
          <div className="space-y-3">
            {issues
              .filter((issue) => issue.status === "IN PROGRESS")
              .map((issue) => (
                <Card key={issue.id} className="cursor-move" draggable onDragStart={() => handleDragStart(issue)}>
                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between">
                      <span className="text-xs text-blue-600 font-mono">{issue.id}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => openCommentDialog(issue)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        {comments[issue.id] && comments[issue.id].length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {comments[issue.id].length}
                          </span>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <CardTitle className="text-sm font-medium">{issue.title}</CardTitle>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{issue.description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* DONE Column */}
        <div
          ref={doneColumnRef}
          className="bg-gray-50 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("DONE")}
        >
          <h2 className="font-semibold mb-3 text-gray-700 flex items-center">
            DONE{" "}
            <span className="ml-2 bg-green-200 text-green-700 px-2 py-0.5 rounded-full text-xs">
              {issues.filter((i) => i.status === "DONE").length}
            </span>
          </h2>
          <div className="space-y-3">
            {issues
              .filter((issue) => issue.status === "DONE")
              .map((issue) => (
                <Card key={issue.id} className="cursor-move" draggable onDragStart={() => handleDragStart(issue)}>
                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between">
                      <span className="text-xs text-blue-600 font-mono">{issue.id}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => openCommentDialog(issue)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        {comments[issue.id] && comments[issue.id].length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {comments[issue.id].length}
                          </span>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <CardTitle className="text-sm font-medium">{issue.title}</CardTitle>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{issue.description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>

      {/* Create Issue Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Issue</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={newIssueTitle}
                onChange={(e) => setNewIssueTitle(e.target.value)}
                placeholder="Issue title"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={newIssueDescription}
                onChange={(e) => setNewIssueDescription(e.target.value)}
                placeholder="Describe the issue"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addIssue}>Create Issue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentIssue?.id}: {currentIssue?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">{currentIssue?.description}</p>

            {currentIssue && comments[currentIssue.id] && comments[currentIssue.id].length > 0 && (
              <div className="mb-4 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Comments</h3>
                <div className="space-y-3">
                  {comments[currentIssue.id].map((c, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-md text-sm">
                      <div className="font-medium text-xs text-gray-500 mb-1">{userId} commented:</div>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-2 mt-4">
              <label htmlFor="comment" className="text-sm font-medium">
                Add Comment
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type your comment here"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addComment}>Post Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function TodoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProtectedRoute>
        <JiraBoard />
      </ProtectedRoute>
    </Suspense>
  )
}
