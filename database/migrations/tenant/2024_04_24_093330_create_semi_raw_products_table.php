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
        Schema::create('ms_semi_raw_products', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->string('code');
            $table->integer('material_id')->unsigned();
            $table->foreign('material_id')->references('id')->on('ms_material')->onDelete('cascade');
            $table->string('size');
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
        Schema::dropIfExists('ms_semi_raw_products');
    }
};
