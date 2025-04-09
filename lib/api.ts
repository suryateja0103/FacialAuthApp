// API endpoints for Jira board data
export const API_ENDPOINTS = {
    JIRA_BOARD: "https://0slplijv56.execute-api.us-east-1.amazonaws.com/dev/jiraboard",
  }
  
  // Types for API requests
  export interface JiraBoardData {
    username: string
    todoItems: JiraIssue[]
    inProgressItems: JiraIssue[]
    doneItems: JiraIssue[]
  }
  
  export interface JiraIssue {
    id: string
    title: string
    description: string
    status: "TO DO" | "IN PROGRESS" | "DONE"
    assignee?: string
  }
  
  // Function to save Jira board data to DynamoDB
  export async function saveJiraBoardData(
    username: string,
    todoItems: JiraIssue[],
    inProgressItems: JiraIssue[],
    doneItems: JiraIssue[],
  ): Promise<boolean> {
    try {
      const response = await fetch(API_ENDPOINTS.JIRA_BOARD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          todoItems,
          inProgressItems,
          doneItems,
        }),
      })
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
  
      return true
    } catch (error) {
      console.error("Error saving Jira board data:", error)
      return false
    }
  }
  
  // Function to get Jira board data from DynamoDB
  export async function getJiraBoardData(username: string): Promise<JiraBoardData | null> {
    try {
      const response = await fetch(`${API_ENDPOINTS.JIRA_BOARD}?username=${encodeURIComponent(username)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error getting Jira board data:", error)
      return null
    }
  }
  