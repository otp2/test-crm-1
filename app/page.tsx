"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, DollarSign, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { getFromLocalStorage } from "@/lib/utils"
import Link from "next/link"

export default function Home() {
  const [stats, setStats] = useState({
    customers: 0,
    reminders: 0,
    contracts: 0,
    income: 0,
    expenses: 0,
  })

  useEffect(() => {
    // Load data from localStorage
    const customers = getFromLocalStorage("customers") || []
    const reminders = getFromLocalStorage("reminders") || []
    const contracts = getFromLocalStorage("contracts") || []
    const expenses = getFromLocalStorage("expenses") || []

    // Calculate total income from contracts
    const totalIncome = contracts.reduce((sum: number, contract: any) => sum + (contract.amount || 0), 0)

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0)

    setStats({
      customers: customers.length,
      reminders: reminders.length,
      contracts: contracts.length,
      income: totalIncome,
      expenses: totalExpenses,
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Summary of your business status</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/customers">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Customers</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.customers}</p>
              <p className="text-xs text-muted-foreground">Total customers</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reminders">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Reminders</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.reminders}</p>
              <p className="text-xs text-muted-foreground">Active reminders</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/contracts">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Contracts</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.contracts}</p>
              <p className="text-xs text-muted-foreground">Total contracts</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/contracts">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Income</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${stats.income.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total income</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/expenses">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Expenses</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${stats.expenses.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total expenses</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/statistics">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Net Profit</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${(stats.income - stats.expenses).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Income minus expenses</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Reminders</CardTitle>
            <CardDescription>List of your reminders for today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">Your today's reminders will be displayed here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Contracts</CardTitle>
            <CardDescription>Recently added contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">Your latest contracts will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

