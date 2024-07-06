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
        Schema::create('stock_raw', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->integer('raw_product_id')->unsigned();
            $table->foreign('raw_product_id')->references('id')->on('ms_raw_product')->onDelete('cascade');
            $table->string('code');
            $table->string('material');
            $table->integer('supplier_id')->unsigned();
            $table->foreign('supplier_id')->references('id')->on('ms_supplier')->onDelete('cascade');
            $table->text('weight');
            $table->string('cogs');
            $table->string('qty');
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
        Schema::dropIfExists('stock_raw');
    }
};
