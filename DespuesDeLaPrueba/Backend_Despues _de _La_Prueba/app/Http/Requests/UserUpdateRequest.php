<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'lastName' => 'sometimes|string|max:255',
            'age' => 'sometimes|integer|min:0|max:120',
            'sex' => 'sometimes|string|in:male,female,other',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                // 🔥 CORRECCIÓN: Ignorar el email actual en la tabla people
                Rule::unique('people', 'email')->ignore($this->route('id'))
            ],
        ];
    }
}
