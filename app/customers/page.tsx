"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash, Phone, MapPin, User } from "lucide-react"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/utils"

interface Customer {
  id: string
  name: string
  mobile: string
  area: string
  notes: string
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    area: "",
    notes: "",
  })

  useEffect(() => {
    const savedCustomers = getFromLocalStorage("customers") || []
    setCustomers(savedCustomers)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCustomer = () => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    }

    const updatedCustomers = [...customers, newCustomer]
    setCustomers(updatedCustomers)
    saveToLocalStorage("customers", updatedCustomers)

    setFormData({
      name: "",
      mobile: "",
      area: "",
      notes: "",
    })

    setIsAddingCustomer(false)
  }

  const handleEditCustomer = () => {
    if (!currentCustomer) return

    const updatedCustomers = customers.map((customer) =>
      customer.id === currentCustomer.id ? { ...customer, ...formData } : customer,
    )

    setCustomers(updatedCustomers)
    saveToLocalStorage("customers", updatedCustomers)

    setFormData({
      name: "",
      mobile: "",
      area: "",
      notes: "",
    })

    setIsEditingCustomer(false)
    setCurrentCustomer(null)
  }

  const handleDeleteCustomer = (id: string) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id)
    setCustomers(updatedCustomers)
    saveToLocalStorage("customers", updatedCustomers)
  }

  const startEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer)
    setFormData({
      name: customer.name,
      mobile: customer.mobile,
      area: customer.area,
      notes: customer.notes,
    })
    setIsEditingCustomer(true)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm) ||
      customer.area.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage your customer information</p>
        </div>
        <Button onClick={() => setIsAddingCustomer(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone number or area"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isAddingCustomer && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
            <CardDescription>Enter new customer information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Full Name</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter customer's full name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="mobile">Phone Number</label>
              <Input
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter customer's phone number"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="area">Area</label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="Enter customer's area"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="notes">Notes</label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter notes about the customer"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingCustomer(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Save</Button>
          </CardFooter>
        </Card>
      )}

      {isEditingCustomer && currentCustomer && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Customer Information</CardTitle>
            <CardDescription>Update customer information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-name">Full Name</label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-mobile">Phone Number</label>
              <Input id="edit-mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-area">Area</label>
              <Input id="edit-area" name="area" value={formData.area} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-notes">Notes</label>
              <Textarea id="edit-notes" name="notes" value={formData.notes} onChange={handleInputChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsEditingCustomer(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {customer.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {customer.mobile}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {customer.area}
                </div>
                <p className="text-sm">{customer.notes}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => startEditCustomer(customer)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteCustomer(customer.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center py-10 text-muted-foreground">
            No customers found. Add a new customer.
          </p>
        )}
      </div>
    </div>
  )
}

