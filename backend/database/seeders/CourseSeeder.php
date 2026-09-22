<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Course::upsert([
            ['name' => 'Bachelor of Science in Information Technology'],
            ['name' => 'Bachelor of Science in Computer Science'],
            ['name' => 'Bachelor of Science in Information Systems'],
        ], ['name'], []);
    }
}
