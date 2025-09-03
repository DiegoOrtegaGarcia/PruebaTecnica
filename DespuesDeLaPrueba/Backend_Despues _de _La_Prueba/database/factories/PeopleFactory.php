<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\People;

class PeopleFactory extends Factory
{
    protected $model = People::class;

    public function definition()
    {
        return [
            'name' => $this->faker->firstName,
            'lastName' => $this->faker->lastName,
            'age' => $this->faker->numberBetween(18, 80),
            'sex' => $this->faker->randomElement(['male', 'female', 'other']),
            'email' => $this->faker->unique()->safeEmail,
        ];
    }
}
