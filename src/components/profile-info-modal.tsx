"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  User as UserIcon,
  CheckCircle,
  CircleAlert,
} from "lucide-react";
import { type User } from "next-auth";
import { useProfileInfoModal } from "@/store/profileInfoModal.store";
import { useSettingsModal } from "@/store/settingsModal.store";
import { formatDate } from "@/lib/utils/format-date";

type Props = {
  user: User;
};

export default function ProfileInfoModal({ user }: Props) {
  const { isOpen, closeProfileInfoModal } = useProfileInfoModal();
  const openSettingsModal = useSettingsModal(
    (state) => state.openSettingsModal
  );
  return (
    <Dialog open={isOpen} onOpenChange={closeProfileInfoModal}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Profile Header Card */}
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user.image || "/placeholder.svg"}
                    alt={user.name || "User Avatar"}
                  />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {(user.name || "SC")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                    {user.emailVerified ? (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          Email verified {formatDate(user.emailVerified)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <CircleAlert className="h-4 w-4 text-red-500" />
                        <span>Email not verified</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => openSettingsModal()}
                    className="mt-4 cursor-pointer"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p className="text-sm mt-1">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm">{user.email}</p>
                    {user.emailVerified && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-500/10 text-green-400 border-green-500/20"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>Account Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </label>
                  <p className="text-sm mt-1">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {user.emailVerified
                      ? "Email Verified"
                      : "Email Not Verified"}
                  </label>
                  {user.emailVerified && (
                    <p className="text-sm mt-1">
                      {formatDate(user.emailVerified)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
