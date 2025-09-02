<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStorageRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\People;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return new UserCollection(People::all());
    }

    public function store(UserStorageRequest $request)
    {
        $validated = $request->validated();

        $user = People::create([
            'name' => $validated['name'],
            'lastName' => $validated['lastName'],
            'age' => $validated['age'],
            'sex' => $validated['sex'],
            'email' => $validated['email'],
        ]);

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
        // 🔥 CORRECCIÓN: Usar People en lugar de User
        $user = People::findOrFail($id);
        $validated = $request->validated();

        $updateData = [];

        if (isset($validated['name'])) {
            $updateData['name'] = $validated['name'];
        }
        if (isset($validated['lastName'])) {
            $updateData['lastName'] = $validated['lastName'];
        }
        if (isset($validated['age'])) {
            $updateData['age'] = $validated['age'];
        }
        if (isset($validated['sex'])) {
            $updateData['sex'] = $validated['sex'];
        }
        if (isset($validated['email'])) {
            $updateData['email'] = $validated['email'];
        }

        $user->update($updateData);

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
