<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStorageRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\People;

class UserController extends Controller
{
    public function index()
    {
        return new UserCollection(People::all());
    }

    public function store(UserStorageRequest $request)
    {
        $user = People::create($request->validated());

        return response()->json([
            'message' => 'User created successfully',
            'user' => new UserResource($user)
        ], 201);
    }

    public function show($id)
    {
        $user = People::findOrFail($id);
        return new UserResource($user);
    }

    public function update(UserUpdateRequest $request, $id)
    {
        $user = People::findOrFail($id);
        $user->update($request->validated());

        return response()->json([
            'message' => 'User updated successfully',
            'user' => new UserResource($user->fresh())
        ]);
    }

    public function destroy($id)
    {
        $user = People::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
