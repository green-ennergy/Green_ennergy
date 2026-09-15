<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function getClients(): JsonResponse
    {
        $clients = Client::with('user')
            ->withCount([
                'projects',
                'quoteRequests',
            ])
            ->get();

        $users = $clients->map(function (Client $client) {
            $user = $client->user;

            return [
                'id' => $user->id_user,
                'id_client' => $client->id_client,
                'name' => $user->name,
                'company' => $user->company,
                'email' => $user->email,
                'phone' => $user->phone,
                'created_at' => $user->creation_date,
                'projects_count' => $client->projects_count,
                'quoteRequests' => $client->quote_requests_count,
            ];
        });

        return response()->json([
            'users' => $users,
        ]);
    }
}
