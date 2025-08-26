export interface MenuItem {
    href: string;
    label: string;
    icon: string;
}


export const menuItems: MenuItem[] = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/users', label: 'Users', icon: '👥' },
    { href: '/settings', label: 'Settings', icon: '⚙️' }
]