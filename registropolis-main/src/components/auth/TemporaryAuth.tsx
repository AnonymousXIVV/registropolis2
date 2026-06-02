
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { TEMPORARY_CREDENTIALS, setupTemporaryUser, isUserSignedIn, clearAuthData } from '@/utils/authUtils';

interface CredentialDisplayProps {
  label: string;
  value: string;
  copyable?: boolean;
}

const CredentialDisplay = ({ label, value, copyable = true }: CredentialDisplayProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied ${label.toLowerCase()} to clipboard`);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-mono">{value}</p>
      </div>
      {copyable && (
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

const TemporaryAuth: React.FC = () => {
  const { signIn, signOut } = useAuth();
  const isSignedIn = isUserSignedIn();

  const handleSignIn = (type: 'admin' | 'user') => {
    // Sign out first (if signed in)
    if (isSignedIn) {
      clearAuthData();
    }
    
    const { user } = setupTemporaryUser(type);
    signIn(user);
    toast.success(`Signed in as ${type}`);
  };

  const handleSignOut = () => {
    signOut();
    clearAuthData();
    toast.success("Signed out successfully");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Temporary Auth Credentials</CardTitle>
        <CardDescription>
          Use these credentials for testing. You can sign in instantly with the buttons below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-semibold">Admin Account</h3>
          <CredentialDisplay label="Email" value={TEMPORARY_CREDENTIALS.admin.email} />
          <CredentialDisplay label="Phone" value={TEMPORARY_CREDENTIALS.admin.phoneNumber} />
          <CredentialDisplay label="Password" value={TEMPORARY_CREDENTIALS.admin.password} />
          <Button 
            variant="outline" 
            className="w-full mt-2" 
            onClick={() => handleSignIn('admin')}
          >
            Sign in as Admin
          </Button>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="font-semibold">User Account</h3>
          <CredentialDisplay label="Email" value={TEMPORARY_CREDENTIALS.user.email} />
          <CredentialDisplay label="Phone" value={TEMPORARY_CREDENTIALS.user.phoneNumber} />
          <CredentialDisplay label="Password" value={TEMPORARY_CREDENTIALS.user.password} />
          <Button 
            variant="outline" 
            className="w-full mt-2" 
            onClick={() => handleSignIn('user')}
          >
            Sign in as User
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        {isSignedIn ? (
          <Button variant="destructive" className="w-full" onClick={handleSignOut}>
            Sign Out
          </Button>
        ) : (
          <p className="text-xs text-center text-muted-foreground w-full">
            Not signed in. Click one of the buttons above to sign in.
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default TemporaryAuth;
