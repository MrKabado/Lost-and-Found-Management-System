<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::upsert([
            ['name' => 'Electronics'],
            ['name' => 'Wallet'],
            ['name' => 'ID Card'],
            ['name' => 'Bag'],
            ['name' => 'School Supplies'],
            ['name' => 'Others'],
        ], ['name'], []);
    }
}
