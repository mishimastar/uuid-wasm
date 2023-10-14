(module

    (global $nanoseconds (mut i64) (i64.const 0))

    (func (export "pasteShiftChar") (param $shift i32) (param $val i32)
        (call $parse16char (i64.extend_i32_u (local.get $val)))
        (i64.shl (i64.extend_i32_u (local.get $shift)))
        (global.get $nanoseconds)
        (i64.add )
        (global.set $nanoseconds)
    )

    (func $parse16char (export "parse16char") (param $char i64) (result i64)
        (i64.sub (local.get $char) (i64.const 87))
        (i64.sub (local.get $char) (i64.const 48))
        (i64.ge_u (local.get $char) (i64.const 58))
        select  
    )

    (func $millis30 (export "getMilliseconds") (result i64)
        (global.get $nanoseconds)
        (i64.const 10000)
        (i64.div_u)
        (i64.const 12219292800000)
        (i64.sub)
        (global.set $nanoseconds (i64.const 0))
    )
)