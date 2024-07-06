<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ms_customer', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->string('code');
            $table->string('name');
            $table->text('address');
            $table->string('phone');
            $table->string('pic');
            $table->string('due_date')->nullable();
            $table->string('cash_payment')->nullable();
            $table->string('status');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->dateTime('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ms_customer');
    }
};
