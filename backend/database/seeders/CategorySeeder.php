<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::insert([
            ['name' => 'Electronics'],
            ['name' => 'Wallet'],
            ['name' => 'ID Card'],
            ['name' => 'Bag'],
            ['name' => 'School Supplies'],
            ['name' => 'Others'],
        ]);
    }
}