"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition">
          <AvatarImage src="/user.png" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-48 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2"
      >
        <div className="px-3 py-2 text-sm">
          <p className="font-medium text-gray-900">John Doe</p>
          <p className="text-gray-500 text-xs">john@example.com</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          Messages
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-500 cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
