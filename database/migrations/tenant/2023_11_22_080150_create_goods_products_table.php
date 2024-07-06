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
        Schema::create('ms_goods_product', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->string('code');
            $table->string('name');
            $table->integer('material_id')->unsigned();
            $table->foreign('material_id')->references('id')->on('ms_material')->onDelete('cascade');
            $table->string('quality');
            $table->text('size');
            $table->string('status');
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
        Schema::dropIfExists('ms_goods_product');
    }
};
