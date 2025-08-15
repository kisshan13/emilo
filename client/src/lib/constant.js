import {
    LayoutDashboard,
    Briefcase,
    DollarSign
} from "lucide-react";

export const roleRedirects = {
    user: "/feed",
    accountant: "/accountant",
    admin: "/admin",
};


export const adminNavLinks = [
    {
        href: "/admin/claims",
        label: "Claims",
        icon: LayoutDashboard,
    },
    {
        href: "/admin/settlements",
        label: "Settlements",
        icon: Briefcase,
    },
    {
        href: "/admin/rates",
        label: "Rates",
        icon: DollarSign,
    },
];

export const accountantNavLinks = [
    {
        href: "/accountant/claims",
        label: "Claims",
        icon: LayoutDashboard,
    },
];