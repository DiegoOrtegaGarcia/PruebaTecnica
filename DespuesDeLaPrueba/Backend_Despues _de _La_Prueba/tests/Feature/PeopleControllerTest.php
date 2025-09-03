<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\People;
use App\Models\User;
use Laravel\Passport\Passport;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PeopleControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear un usuario de prueba y autenticar
        Passport::actingAs(User::factory()->create(), ['*']);

        $this->withHeaders([
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest'
        ]);
    }


    /** @test */
    public function puede_listar_personas()
    {
        People::factory()->count(3)->create();

        $response = $this->get('/api/people');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function puede_crear_persona()
    {
        $data = [
            'name' => 'María',
            'lastName' => 'López',
            'age' => 28,
            'sex' => 'female',
            'email' => 'maria@example.com'
        ];

        $response = $this->post('/api/people', $data);

        $response->assertStatus(201)
            ->assertJson(['message' => 'User created successfully']);

        $this->assertDatabaseHas('people', ['email' => 'maria@example.com']);
    }

    /** @test */
    public function validacion_funciona_correctamente()
    {
        $data = [
            'name' => '', // Nombre vacío - DEBE fallar
            'lastName' => 'López',
            'age' => 150, // Edad inválida - DEBE fallar
            'sex' => 'invalid', // Sexo inválido - DEBE fallar
            'email' => 'no-email' // Email inválido - DEBE fallar
        ];

        $response = $this->post('/api/people', $data);

        // VERIFICAMOS que la validación falló como se esperaba
        $response->assertStatus(422); // Unprocessable Entity

        // VERIFICAMOS que existen errores en los campos esperados
        $response->assertJsonValidationErrors([
            'name',
            'age',
            'sex',
            'email'
        ]);

        // OPCIONAL: Verificar mensajes específicos de error
        $response->assertJsonValidationErrorFor('name');
        $response->assertJsonValidationErrorFor('age');
        $response->assertJsonValidationErrorFor('sex');
        $response->assertJsonValidationErrorFor('email');

        // OPCIONAL: Verificar que el campo lastName NO tiene error (porque es válido)
        $this->assertArrayNotHasKey('lastName', $response->json('errors'));
    }

    /** @test */
    public function validacion_acepta_datos_correctos()
    {
        $data = [
            'name' => 'Juan', // Nombre válido
            'lastName' => 'Pérez', // Apellido válido
            'age' => 30, // Edad válida
            'sex' => 'male', // Sexo válido
            'email' => 'juan@example.com' // Email válido
        ];

        $response = $this->post('/api/people', $data);

        // ESTE test debe pasar con status 201 (Created)
        $response->assertStatus(201);

        // Y NO debe tener errores de validación
        $response->assertJsonMissingValidationErrors();

        // Y la persona debe crearse en la base de datos
        $this->assertDatabaseHas('people', ['email' => 'juan@example.com']);
    }

    /** @test */
    public function puede_eliminar_persona()
    {
        $persona = People::factory()->create();

        $response = $this->delete("/api/people/{$persona->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'User deleted successfully']);

        $this->assertDatabaseMissing('people', ['id' => $persona->id]);
    }
}
