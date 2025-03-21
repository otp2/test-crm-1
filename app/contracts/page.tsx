"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash, FileText, DollarSign, Calendar, User } from "lucide-react"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/utils"

interface Contract {
  id: string
  title: string
  customerName: string
  description: string
  amount: number
  date: string
  createdAt: string
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingContract, setIsAddingContract] = useState(false)
  const [isEditingContract, setIsEditingContract] = useState(false)
  const [currentContract, setCurrentContract] = useState<Contract | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    customerName: "",
    description: "",
    amount: "",
    date: "",
  })

  useEffect(() => {
    const savedContracts = getFromLocalStorage("contracts") || []
    setContracts(savedContracts)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddContract = () => {
    const newContract: Contract = {
      id: Date.now().toString(),
      title: formData.title,
      customerName: formData.customerName,
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date,
      createdAt: new Date().toISOString(),
    }

    const updatedContracts = [...contracts, newContract]
    setContracts(updatedContracts)
    saveToLocalStorage("contracts", updatedContracts)

    setFormData({
      title: "",
      customerName: "",
      description: "",
      amount: "",
      date: "",
    })

    setIsAddingContract(false)
  }

  const handleEditContract = () => {
    if (!currentContract) return

    const updatedContracts = contracts.map((contract) =>
      contract.id === currentContract.id
        ? {
            ...contract,
            title: formData.title,
            customerName: formData.customerName,
            description: formData.description,
            amount: Number(formData.amount),
            date: formData.date,
          }
        : contract,
    )

    setContracts(updatedContracts)
    saveToLocalStorage("contracts", updatedContracts)

    setFormData({
      title: "",
      customerName: "",
      description: "",
      amount: "",
      date: "",
    })

    setIsEditingContract(false)
    setCurrentContract(null)
  }

  const handleDeleteContract = (id: string) => {
    const updatedContracts = contracts.filter((contract) => contract.id !== id)
    setContracts(updatedContracts)
    saveToLocalStorage("contracts", updatedContracts)
  }

  const startEditContract = (contract: Contract) => {
    setCurrentContract(contract)
    setFormData({
      title: contract.title,
      customerName: contract.customerName,
      description: contract.description,
      amount: contract.amount.toString(),
      date: contract.date,
    })
    setIsEditingContract(true)
  }

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort contracts by date (newest first)
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Calculate total amount
  const totalAmount = sortedContracts.reduce((sum, contract) => sum + contract.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contracts & Sales</h1>
          <p className="text-muted-foreground">Manage your contracts and sales</p>
        </div>
        <Button onClick={() => setIsAddingContract(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Contract
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search contracts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contracts Summary</CardTitle>
          <CardDescription>Overall statistics of contracts and sales</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">Total Contracts</p>
            <p className="text-3xl font-bold">{contracts.length}</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">Total Contract Value</p>
            <p className="text-3xl font-bold">${totalAmount.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      {isAddingContract && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Contract</CardTitle>
            <CardDescription>Enter new contract information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title">Contract Title</label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter contract title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="customerName">Customer Name</label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter contract description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="amount">Amount ($)</label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter contract amount"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="date">Contract Date</label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingContract(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContract}>Save</Button>
          </CardFooter>
        </Card>
      )}

      {isEditingContract && currentContract && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Contract</CardTitle>
            <CardDescription>Update contract information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-title">Contract Title</label>
              <Input id="edit-title" name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-customerName">Customer Name</label>
              <Input
                id="edit-customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
              />
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
                <label htmlFor="edit-amount">Amount ($)</label>
                <Input
                  id="edit-amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-date">Contract Date</label>
                <Input id="edit-date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsEditingContract(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditContract}>Save Changes</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedContracts.length > 0 ? (
          sortedContracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {contract.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {contract.customerName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {contract.date}
                </div>
                <div className="flex items-center gap-2 mb-2 text-sm font-bold">
                  <DollarSign className="h-4 w-4" />${contract.amount.toLocaleString()}
                </div>
                <p className="text-sm">{contract.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => startEditContract(contract)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteContract(contract.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center py-10 text-muted-foreground">
            No contracts found. Add a new contract.
          </p>
        )}
      </div>
    </div>
  )
}

