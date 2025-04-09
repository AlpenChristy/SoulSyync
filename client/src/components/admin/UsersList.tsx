import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Search, UserCog, AtSign } from "lucide-react";

const UsersList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [roleValue, setRoleValue] = useState<string>("");

  // Fetch users
  const { data, isLoading } = useQuery<{ success: boolean; data: User[] }>({
    queryKey: ["/api/users"],
  });

  const users = data?.data || [];

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update user role mutation
  const updateUserRole = useMutation({
    mutationFn: async (data: { userId: number; role: string }) => {
      const res = await apiRequest("PUT", `/api/users/${data.userId}`, {
        role: data.role,
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Success",
          description: "User role updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        setIsEditDialogOpen(false);
        setSelectedUser(null);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update user role",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Open edit user dialog
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setRoleValue(user.role);
    setIsEditDialogOpen(true);
  };

  // Submit role update
  const handleRoleSubmit = () => {
    if (!selectedUser || !roleValue || roleValue === selectedUser.role) return;
    
    updateUserRole.mutate({
      userId: selectedUser.id,
      role: roleValue,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold mb-6">User Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
              {searchTerm && (
                <p className="text-sm text-gray-400 mt-2">
                  Try a different search term
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profileImage || ""} />
                            <AvatarFallback className="bg-primary-100 text-primary-600">
                              {user.fullName ? getInitials(user.fullName) : user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName || user.username}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <AtSign className="h-3.5 w-3.5 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "secondary" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="flex items-center gap-1"
                        >
                          <UserCog className="h-3.5 w-3.5" />
                          <span>Edit Role</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the permission level for this user.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser?.profileImage || ""} />
                  <AvatarFallback className="bg-primary-100 text-primary-600">
                    {selectedUser?.fullName 
                      ? getInitials(selectedUser.fullName) 
                      : selectedUser?.username.substring(0, 2).toUpperCase()
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser?.fullName || selectedUser?.username}</div>
                  <div className="text-sm text-gray-500">@{selectedUser?.username}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-2">
              <p className="text-sm font-medium mb-1">Current Role:</p>
              <Badge variant={selectedUser?.role === "admin" ? "secondary" : "outline"}>
                {selectedUser?.role}
              </Badge>
            </div>
            
            <div className="space-y-2 mt-4">
              <label htmlFor="role" className="text-sm font-medium">
                New Role:
              </label>
              <Select value={roleValue} onValueChange={setRoleValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
              
              {roleValue === "admin" && (
                <p className="text-sm text-amber-600 mt-2">
                  Warning: Administrators have full access to manage all aspects of the system, including user data, appointments, content, and settings.
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRoleSubmit} 
              disabled={!roleValue || roleValue === selectedUser?.role}
              variant={roleValue === "admin" ? "secondary" : "default"}
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersList;
