<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\People;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PeopleTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function puede_crear_una_persona()
    {
        $persona = People::create([
            'name' => 'Juan',
            'lastName' => 'Pérez',
            'age' => 30,
            'sex' => 'male',
            'email' => 'juan@example.com'
        ]);

        $this->assertDatabaseHas('people', [
            'email' => 'juan@example.com'
        ]);
    }

    /** @test */
    public function email_debe_ser_unico()
    {
        People::create([
            'name' => 'Juan',
            'lastName' => 'Pérez',
            'age' => 30,
            'sex' => 'male',
            'email' => 'juan@example.com'
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        People::create([
            'name' => 'Ana',
            'lastName' => 'Gómez',
            'age' => 25,
            'sex' => 'female',
            'email' => 'juan@example.com' // Mismo email
        ]);
    }

    /** @test */
    public function edad_debe_ser_entre_0_y_120()
    {
        $persona = People::create([
            'name' => 'Juan',
            'lastName' => 'Pérez',
            'age' => 30,
            'sex' => 'male',
            'email' => 'juan@example.com'
        ]);

        $this->assertGreaterThanOrEqual(0, $persona->age);
        $this->assertLessThanOrEqual(120, $persona->age);
    }
}
