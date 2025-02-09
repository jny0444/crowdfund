"use client"

import { useClient } from "@/hooks/useClient";

export default () => {
    const client = useClient();

    return (
        <div>
            <h1>Wallet address</h1>
            <button onClick={() => useClient()}>Get address</button>
        </div>
    );
};