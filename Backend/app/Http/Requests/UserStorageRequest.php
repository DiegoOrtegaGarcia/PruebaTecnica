<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStorageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'age' => 'required|integer|min:0|max:120',
            // 🔥 CORRECCIÓN: Cambiar de boolean a string con opciones
            'sex' => 'required|string|in:male,female,other',
            // 🔥 CORRECCIÓN: Cambiar tabla de users a people
            'email' => 'required|string|email|max:255|unique:people,email',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio',
            'lastName.required' => 'El apellido es obligatorio',
            'age.required' => 'La edad es obligatoria',
            'age.min' => 'La edad debe ser mayor a 0',
            'age.max' => 'La edad no puede ser mayor a 120',
            'sex.required' => 'El sexo es obligatorio',
            // 🔥 CORRECCIÓN: Mensaje coherente con la validación
            'sex.in' => 'El sexo debe ser: male, female u other',
            'email.required' => 'El email es obligatorio',
            'email.unique' => 'El email ya está registrado',
        ];
    }
}
