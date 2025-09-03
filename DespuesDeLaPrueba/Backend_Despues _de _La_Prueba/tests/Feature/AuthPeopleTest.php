<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\People;
use App\Models\User;
use Laravel\Passport\Passport;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthPeopleTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function usuario_no_autenticado_no_puede_acceder_a_personas()
    {
        // No autenticar ningún usuario

        $response = $this->getJson('/api/people');

        $response->assertStatus(401); // Unauthorized
    }

    /** @test */
    public function usuario_autenticado_puede_listar_personas()
    {
        $user = User::factory()->create();
        Passport::actingAs($user, ['*']);

        People::factory()->count(3)->create();

        $response = $this->getJson('/api/people');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function usuario_autenticado_puede_crear_persona()
    {
        $user = User::factory()->create();
        Passport::actingAs($user, ['*']);

        $data = [
            'name' => 'Test',
            'lastName' => 'User',
            'age' => 25,
            'sex' => 'male',
            'email' => 'test@example.com'
        ];

        $response = $this->postJson('/api/people', $data);

        $response->assertStatus(201);
    }

    /** @test */
    public function token_invalido_devuelve_error_401()
    {
        $this->withHeaders([
            'Authorization' => 'Bearer invalid-token',
            'Accept' => 'application/json'
        ]);

        $response = $this->getJson('/api/people');

        $response->assertStatus(401);
    }
}
