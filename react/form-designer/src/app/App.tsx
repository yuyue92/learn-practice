import { DesignerProvider } from "../state/designerContext";
import { AuthProvider, useAuth } from "../auth/AuthContext";
import { LoginPage } from "../pages/LoginPage";
import { AppShell } from "../layout/AppShell";

function AuthGate() {
    const { user } = useAuth();
    if (!user) return <LoginPage />;
    return (
        <DesignerProvider>
            <AppShell />
        </DesignerProvider>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AuthGate />
        </AuthProvider>
    );
}