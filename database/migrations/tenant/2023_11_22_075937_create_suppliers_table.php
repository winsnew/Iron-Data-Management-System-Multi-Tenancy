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
        Schema::create('ms_supplier', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->string('code');
            $table->string('name');
            $table->string('type');
            $table->string('pic');
            $table->text('address');
            $table->string('phone');
            $table->string('payment_due');
            $table->integer('status');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->dateTime('deleted_at')->nullable();
            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ms_supplier');
    }
};
