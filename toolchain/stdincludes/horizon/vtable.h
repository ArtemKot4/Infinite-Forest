//
// Created by zheka on 18/11/10.
//

#ifndef HORIZON_VTABLE_H
#define HORIZON_VTABLE_H

#include <string.h>

namespace VTableManager {
    int __vtable_index(void*, const char*);

    bool __init_vtable(void*, std::string, std::string, const char*);

    void __override_virtual(void*, void*, const char*);

    void* get_method(void*, int);
};



// must be on top of any class, that uses VTable API, pre-defines vtable initializer
#define VTABLE virtual void __init_vtable_ptr() {};\
                            bool __init_vtable(std::string lib, std::string symbol, const char* clazz) {\
                                return VTableManager::__init_vtable(this, lib, symbol, clazz);\
                            }

// must be called inside constructor before any other code, all constructors must call this, starts section of vtable initialization and defines vtable symbol
// LIB - name of lib handle
// SYMBOL - name of vtable symbol
#define VTABLE_BEGIN(LIB, SYMBOL) if (__init_vtable(LIB, SYMBOL, __func__)) {

// ends VTABLE_BEGIN / VTABLE_END section
#define VTABLE_END }

// short for VTABLE_BEGIN / VTABLE_END section, if no OVERRIDE_INIT calls is required
#define VTABLE_INIT(LIB, SYMBOL) VTABLE_BEGIN(LIB, SYMBOL) VTABLE_END

// defines virtual method with no body, that will call method from vtable
// SYMBOL - method symbol name, that is contained inside vtable given in VTABLE_BEGIN or VTABLE_INIT
// RETURN - method return type
// HEADER - method header without return type: name(arg1, arg2, ...)
#define VIRTUAL(SYMBOL, RETURN, HEADER) \
                                    RETURN HEADER {\
                                        static int __vtable_index = -1;\
                                        if (__vtable_index < 0) {\
                                            __vtable_index = VTableManager::__vtable_index(this, SYMBOL);\
                                        }\
                                        return ((RETURN (*) (void*)) VTableManager::get_method(this, __vtable_index)) (this);\
                                    }

// defines virtual method, that overrides some method of parent class
// CLASS - current class name
// RETURN - return type
// NAME - method name
// ARGS - method args inside () brackets
// CODE - method code inside {} brackets
#define OVERRIDE(CLASS, RETURN, NAME, ARGS, CODE)  RETURN NAME ARGS CODE\
                                            static RETURN __callback_##NAME (CLASS* self, void* params) {\
                                                return std::bind(&CLASS::NAME, self)(params);\
                                            }

// initializes override method in vtable, must be inside VTABLE_BEGIN / VTABLE_END section
#define OVERRIDE_INIT(SYMBOL, NAME) VTableManager::__override_virtual(this, (void*) (&__callback_##NAME), SYMBOL);


/*
EXAMPLE:
    class SampleClass {
        VTABLE

        VIRTUAL("virtual symbol1", void, virtual1(int* param, int count))
        VIRTUAL("virtual symbol2", bool, virtual2(void))

        OVERRIDE(SampleClass, void, override1, (int param), {
            ...
        })

        OVERRIDE(SampleClass, std::string, override2, (), {
            ...
            return "sample";
        })

        SampleClass() {
            VTABLE_BEGIN("mcpe", "...")
                OVERRIDE_INIT("symbol to override1", override1)
                OVERRIDE_INIT("symbol to override2", override2)
            VTABLE_END

            ...
        }
    }
 */
#include <symbol.h>
#include <logger.h>

#include <dlfcn.h>




template <typename R, typename... ARGS>
R VTABLE_CALL(int index, void* target, ARGS... args) {
    return (*(R (**) (void*, ARGS...)) (*(char**) target + index * 4))(target, args...);
};


template <typename R, typename... ARGS>
R VTABLE_CALL_RESULT_PTR(int index, void* result, void* target, ARGS... args) {
    return (*(R (**) (void*, void*, ARGS...)) (*(char**) target + index * 4))(result, target, args...);
};

inline int getVtableOffset(const char* vtableName, const char* functionName) {
    void** vtable = (void**) SYMBOL("mcpe", vtableName);
    void* func = SYMBOL("mcpe", functionName);
    for (int i = 2; vtable[i]; i++) {
        if (vtable[i] == func) {
            i -= 2;
            return i;
        }
    }
    Logger::error("InnerCoregetVtableOffset", "failed to find '%s' in '%s'", functionName, vtableName);
    return -1;
}

inline int getVtableOffset(const char* vtableName, const char* functionName, const char* lib) {
    void** vtable = (void**) SYMBOL(lib, vtableName);
    void* func = SYMBOL(lib, functionName);
    for (int i = 2; vtable[i]; i++) {
        if (vtable[i] == func) {
            i -= 2;
            return i;
        }
    }
    Logger::error("InnerCoregetVtableOffset", "failed to find '%s' in '%s'", functionName, vtableName);
    return -1;
}


inline int getVtableOffset(void* a, const char* functionName) {
    void** vtable = *(void***) a;
    void* func = SYMBOL("mcpe", functionName);
    for (int i = 2; vtable[i]; i++) {
        if (vtable[i] == func) {
            i -= 2;
            return i;
        }
    }
    Logger::error("InnerCoregetVtableOffset", "failed to find '%s' in '%s'", functionName);
    return -1;
}

#define VTABLE_FIND_OFFSET(variableName, vtableName, functionName) static int variableName = -1; if (variableName == -1) { variableName = getVtableOffset(#vtableName, #functionName); };
#define VTABLE_SET(vtableVariableName, vtableName, functionName) VTABLE_FIND_OFFSET(_ZTV ## vtableName ## functionName, vtableName, functionName); ((void**) vtableVariableName)[_ZTV ## vtableName ## functionName]



#endif //HORIZON_VTABLE_H
