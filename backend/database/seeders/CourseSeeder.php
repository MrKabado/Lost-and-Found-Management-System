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
        $courses = [
            ['name' => 'Bachelor of Science in Information Technology'],
            ['name' => 'Bachelor of Science in Hospitality Management'],
            ['name' => 'Bachelor of Elementary Education'],
            ['name' => 'Bachelor of Secondary Education'],
        ];

        Course::query()
            ->whereNotIn('name', array_column($courses, 'name'))
            ->whereDoesntHave('studentProfiles')
            ->delete();

        Course::upsert($courses, ['name'], []);
    }
}
