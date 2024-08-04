<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tenants\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    protected $name;
    protected $email;
    protected $password;

    public function __construct($name = null, $email = null, $password = null)
    {
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
    }

    public function run(): void
    {
        if ($this->name && $this->email && $this->password) {
            User::create([
                'name' => $this->name,
                'email' => $this->email,
                'password' => bcrypt($this->password),
            ]);
        }
    }
}
